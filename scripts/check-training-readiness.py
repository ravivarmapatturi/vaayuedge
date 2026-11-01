"""Report whether the documented training gate can be opened.

This check is intentionally read-only and dependency-light.  It does not
download models or data, import Lightning, allocate a GPU, or change the gate.
It makes the missing prerequisites explicit so a later run can be audited.
"""
import argparse
import hashlib
import importlib.util
import json
import os
import tempfile
from pathlib import Path


def is_sha256(value: object) -> bool:
    """Return whether value is a canonical lowercase/uppercase SHA-256 hex digest."""
    if not isinstance(value, str) or len(value) != 64:
        return False
    try:
        int(value, 16)
    except ValueError:
        return False
    return True


def check(path: Path, required: list[str]) -> dict:
    result = {"path": str(path), "exists": path.exists()}
    if path.exists():
        try:
            payload = json.loads(path.read_text(encoding="utf-8"))
            result["valid_json"] = isinstance(payload, (dict, list))
            result["required_fields_present"] = all(
                field in payload for field in required
            ) if isinstance(payload, dict) else False
        except (OSError, json.JSONDecodeError):
            result["valid_json"] = False
            result["required_fields_present"] = False
    else:
        result["valid_json"] = False
        result["required_fields_present"] = False
    return result


def check_candidate_inventory(path: Path) -> dict:
    result = check(path, ["candidates"])
    result["candidate_entries_valid"] = False
    result["candidate_count"] = 0
    if not result["valid_json"]:
        return result
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
        candidates = payload.get("candidates") if isinstance(payload, dict) else None
        result["candidate_count"] = len(candidates) if isinstance(candidates, list) else 0
        entries_valid = bool(candidates) and all(
            isinstance(candidate, dict)
            and isinstance(candidate.get("id"), str) and candidate["id"].strip()
            and isinstance(candidate.get("role"), str) and candidate["role"].strip()
            for candidate in candidates
        )
        ids = [candidate["id"].strip() for candidate in candidates if isinstance(candidate, dict) and isinstance(candidate.get("id"), str)]
        result["candidate_ids_unique"] = len(ids) == len(set(ids))
        result["candidate_entries_valid"] = entries_valid and result["candidate_ids_unique"]
    except (OSError, json.JSONDecodeError, AttributeError, TypeError):
        pass
    return result


def check_training_manifest(path: Path) -> dict:
    result = check(path, [])
    result["schema"] = "unknown"
    result["split_names_present"] = False
    result["split_entries_valid"] = False
    result["split_files_present"] = False
    result["split_row_counts_match"] = False
    result["split_hashes_match"] = False
    result["input_hash_present"] = False
    if not result["valid_json"]:
        return result
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
        input_hash = payload.get("input_sha256")
        result["input_hash_present"] = is_sha256(input_hash)
        if not result["input_hash_present"]:
            return result
        expected = {"train", "validation", "test"}
        splits = payload.get("splits")
        if isinstance(splits, dict):
            result["schema"] = "per-split"
            result["split_names_present"] = expected <= set(splits)
            result["split_entries_valid"] = result["split_names_present"] and all(
                isinstance(splits[name], dict)
                and isinstance(splits[name].get("rows"), int)
                and splits[name]["rows"] > 0
                and is_sha256(splits[name].get("sha256"))
                for name in expected
            )
            if result["split_entries_valid"]:
                result["split_files_present"] = all(
                    path.parent.joinpath(f"{name}.jsonl").is_file() for name in expected
                )
                if result["split_files_present"]:
                    actual_counts = {}
                    actual_hashes = {}
                    for name in expected:
                        split_path = path.parent / f"{name}.jsonl"
                        actual_counts[name] = sum(
                            1 for line in split_path.open(encoding="utf-8") if line.strip()
                        )
                        actual_hashes[name] = hashlib.sha256(
                            split_path.read_bytes()
                        ).hexdigest()
                    result["actual_row_counts"] = actual_counts
                    result["actual_sha256"] = actual_hashes
                    result["split_row_counts_match"] = all(
                        actual_counts[name] == splits[name]["rows"] for name in expected
                    )
                    result["split_hashes_match"] = all(
                        actual_hashes[name] == splits[name]["sha256"] for name in expected
                    )
                result["split_entries_valid"] = (
                    result["split_files_present"]
                    and result["split_row_counts_match"]
                    and result["split_hashes_match"]
                )
        elif isinstance(payload.get("counts"), dict):
            result["schema"] = "counts"
            counts = payload["counts"]
            result["split_names_present"] = expected <= set(counts)
            result["split_entries_valid"] = result["split_names_present"] and all(
                isinstance(counts[name], int) and counts[name] > 0 for name in expected
            )
            result["split_files_present"] = result["split_entries_valid"] and all(
                path.parent.joinpath(f"{name}.jsonl").is_file() for name in expected
            )
            if result["split_files_present"]:
                actual_counts = {}
                for name in expected:
                    split_path = path.parent / f"{name}.jsonl"
                    with split_path.open(encoding="utf-8") as split_file:
                        actual_counts[name] = sum(1 for line in split_file if line.strip())
                result["actual_row_counts"] = actual_counts
                result["split_row_counts_match"] = all(
                    actual_counts[name] == counts[name] for name in expected
                )
                declared_hashes = payload.get("split_sha256")
                if declared_hashes is None:
                    result["split_hashes_present"] = False
                    result["split_hashes_match"] = False
                elif isinstance(declared_hashes, dict):
                    result["split_hashes_present"] = expected <= set(declared_hashes)
                    actual_hashes = {
                        name: hashlib.sha256(
                            (path.parent / f"{name}.jsonl").read_bytes()
                        ).hexdigest()
                        for name in expected
                    }
                    result["actual_sha256"] = actual_hashes
                    result["split_hashes_match"] = (
                        result["split_hashes_present"]
                        and all(
                            is_sha256(declared_hashes[name])
                            and declared_hashes[name] == actual_hashes[name]
                            for name in expected
                        )
                    )
                else:
                    result["split_hashes_present"] = False
                    result["split_hashes_match"] = False
            result["split_entries_valid"] = (
                result["split_entries_valid"]
                and result["split_files_present"]
                and result["split_row_counts_match"]
                and result["split_hashes_present"]
                and result["split_hashes_match"]
                and result["input_hash_present"]
            )
    except (OSError, json.JSONDecodeError, AttributeError, TypeError):
        pass
    return result


def check_corpus_inventory(path: Path) -> dict:
    """Check that candidate training corpora have an explicit cleared status."""
    result = check(path, ["corpora"])
    result["candidate_corpora_count"] = 0
    result["unresolved_candidate_corpora"] = []
    result["candidate_corpora_rights_clear"] = False
    if not result["valid_json"]:
        return result
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
        corpora = payload.get("corpora") if isinstance(payload, dict) else None
        candidates = [
            corpus for corpus in corpora
            if isinstance(corpus, dict)
            and isinstance(corpus.get("role"), str)
            and "training" in corpus["role"]
        ] if isinstance(corpora, list) else []
        result["candidate_corpora_count"] = len(candidates)
        unresolved = []
        for corpus in candidates:
            status = corpus.get("license_status") or corpus.get("commercial_training_status")
            if status != "cleared":
                unresolved.append({"id": corpus.get("id"), "status": status})
        result["unresolved_candidate_corpora"] = unresolved
        result["candidate_corpora_rights_clear"] = bool(candidates) and not unresolved
    except (OSError, json.JSONDecodeError, AttributeError, TypeError):
        pass
    return result


def check_deployment_preflight(path: Path) -> dict:
    """Check the persisted local-bundle preflight without loading a bundle."""
    result = check(path, ["missing_bundles", "ready_for_local_bundle_benchmark"])
    result["missing_bundles"] = []
    result["ready_for_local_bundle_benchmark"] = False
    result["preflight_valid"] = False
    if not result["valid_json"]:
        return result
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
        missing = payload.get("missing_bundles")
        ready = payload.get("ready_for_local_bundle_benchmark")
        result["missing_bundles"] = missing if isinstance(missing, list) else []
        result["ready_for_local_bundle_benchmark"] = ready is True and not result["missing_bundles"]
        result["preflight_valid"] = isinstance(missing, list) and isinstance(ready, bool)
    except (OSError, json.JSONDecodeError, AttributeError, TypeError):
        pass
    return result


def check_corpus_rights_audit(path: Path, inventory_path: Path) -> dict:
    """Verify the pinned BPCC artifact audit is present and still blocked."""
    result = {
        "path": str(path),
        "exists": path.is_file(),
        "valid_json": False,
        "repository": None,
        "revision": None,
        "artifact_path": None,
        "artifact_oid": None,
        "decision": None,
        "training_status": None,
        "matches_inventory": False,
        "authoritative_rights_clear": False,
    }
    if not path.is_file() or not inventory_path.is_file():
        return result
    try:
        audit = json.loads(path.read_text(encoding="utf-8"))
        inventory = json.loads(inventory_path.read_text(encoding="utf-8"))
        result["valid_json"] = isinstance(audit, dict)
        artifact = audit.get("artifact") if isinstance(audit, dict) else None
        hub_api = audit.get("hub_api") if isinstance(audit, dict) else None
        result["repository"] = audit.get("repository") if isinstance(audit, dict) else None
        result["revision"] = audit.get("revision") if isinstance(audit, dict) else None
        result["artifact_path"] = artifact.get("path") if isinstance(artifact, dict) else None
        result["artifact_oid"] = artifact.get("oid") if isinstance(artifact, dict) else None
        result["decision"] = audit.get("decision") if isinstance(audit, dict) else None
        result["training_status"] = audit.get("training_status") if isinstance(audit, dict) else None
        bpcc = next(
            (item for item in inventory.get("corpora", [])
             if isinstance(item, dict) and item.get("id") == "ai4bharat/BPCC"),
            None,
        )
        result["matches_inventory"] = bool(
            isinstance(bpcc, dict)
            and result["repository"] == bpcc.get("id")
            and result["revision"] == bpcc.get("revision")
            and result["artifact_path"] == bpcc.get("file")
            and isinstance(hub_api, dict)
            and hub_api.get("resolved_sha") == result["revision"]
            and isinstance(result["artifact_oid"], str)
            and len(result["artifact_oid"]) == 40
        )
        result["authoritative_rights_clear"] = bool(
            result["matches_inventory"]
            and result["decision"] == "cleared"
            and result["training_status"] == "cleared"
        )
    except (OSError, json.JSONDecodeError, AttributeError, TypeError):
        pass
    return result


def check_model_license_audit(path: Path) -> dict:
    """Expose named unresolved model-license holds from the audit record."""
    result = {
        "path": str(path),
        "exists": path.is_file(),
        "research_only_hold": False,
        "unresolved_holds": [],
    }
    if not path.is_file():
        return result
    try:
        audit_text = path.read_text(encoding="utf-8").lower()
    except OSError:
        return result
    result["research_only_hold"] = (
        "research-only hold" in audit_text or "not clearance" in audit_text
    )
    hold_markers = (
        ("bodhan", "Bodhan gated access/terms and provenance"),
        ("gemma", "Gemma upstream terms and provenance"),
    )
    result["unresolved_holds"] = [
        label for marker, label in hold_markers
        if marker in audit_text and result["research_only_hold"]
    ]
    return result


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--manifest", type=Path)
    parser.add_argument("--candidate-inventory", type=Path,
                        default=Path("docs/model-candidate-inventory.json"))
    parser.add_argument("--license-audit", type=Path,
                        default=Path("docs/model-license-audit.md"))
    parser.add_argument("--corpus-inventory", type=Path,
                        default=Path("docs/corpus-inventory.json"))
    parser.add_argument("--deployment-preflight", type=Path,
                        default=Path("docs/evidence/deployment-preflight-2026-10-28.json"))
    parser.add_argument("--corpus-rights-audit", type=Path,
                        default=Path("docs/evidence/bpcc-rights-audit-2026-10-28.json"))
    parser.add_argument("--output", type=Path,
                        help="write the JSON report to this path in addition to stdout")
    args = parser.parse_args()

    checks = {
        "lightning_importable": importlib.util.find_spec("lightning") is not None,
        "sacrebleu_importable": importlib.util.find_spec("sacrebleu") is not None,
        "candidate_inventory": check_candidate_inventory(args.candidate_inventory),
        "license_audit": check_model_license_audit(args.license_audit),
        "corpus_inventory": check_corpus_inventory(args.corpus_inventory),
        "corpus_rights_audit": check_corpus_rights_audit(
            args.corpus_rights_audit, args.corpus_inventory
        ),
        "deployment_preflight": check_deployment_preflight(args.deployment_preflight),
    }
    if args.manifest:
        checks["training_manifest"] = check_training_manifest(args.manifest)
    else:
        checks["training_manifest"] = {"provided": False}

    blockers = []
    if not checks["lightning_importable"]:
        blockers.append("lightning is not installed")
    if not checks["sacrebleu_importable"]:
        blockers.append("sacrebleu is not installed")
    if not checks["candidate_inventory"]["required_fields_present"]:
        blockers.append("candidate inventory is missing or invalid")
    elif not checks["candidate_inventory"]["candidate_entries_valid"]:
        blockers.append("candidate inventory must contain non-empty entries with id and role")
    if not checks["license_audit"]["exists"]:
        blockers.append("model license audit is missing")
    elif checks["license_audit"]["research_only_hold"]:
        blockers.append("model license audit remains research-only")
        for hold in checks["license_audit"]["unresolved_holds"]:
            blockers.append(f"unresolved model-license hold: {hold}")
    corpus = checks["corpus_inventory"]
    if not corpus["exists"] or not corpus["valid_json"]:
        blockers.append("corpus inventory is missing or invalid")
    elif not corpus["candidate_corpora_rights_clear"]:
        unresolved = ", ".join(
            str(item.get("id") or "unnamed") for item in corpus["unresolved_candidate_corpora"]
        )
        blockers.append(f"candidate training corpus rights are unresolved: {unresolved or 'none cleared'}")
    rights_audit = checks["corpus_rights_audit"]
    if not rights_audit["exists"] or not rights_audit["valid_json"]:
        blockers.append("BPCC artifact-rights audit is missing or invalid")
    elif not rights_audit["matches_inventory"]:
        blockers.append("BPCC artifact-rights audit does not match the pinned inventory")
    elif not rights_audit["authoritative_rights_clear"]:
        blockers.append("BPCC artifact-rights audit remains unresolved")
    preflight = checks["deployment_preflight"]
    if not preflight["exists"] or not preflight["valid_json"] or not preflight["preflight_valid"]:
        blockers.append("deployment preflight is missing or invalid")
    elif not preflight["ready_for_local_bundle_benchmark"]:
        missing = ", ".join(str(item) for item in preflight["missing_bundles"])
        blockers.append(f"deployment bundles are missing: {missing or 'unknown'}")
    if args.manifest:
        manifest = checks["training_manifest"]
        if not manifest["valid_json"]:
            blockers.append("training manifest is missing or invalid")
        elif not manifest["split_names_present"]:
            blockers.append("training manifest must contain train/validation/test splits")
        elif not manifest["split_entries_valid"]:
            blockers.append("training manifest input/split entries, files, row counts, or hashes are invalid")

    rendered = json.dumps({
        "evidence_class": "readiness diagnostic; not a training result",
        "gpu_gate": "NOT READY" if blockers else "REVIEW REQUIRED",
        "blockers": blockers,
        "checks": checks,
    }, indent=2, sort_keys=True)
    print(rendered)
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        # Keep the persisted audit all-or-nothing if the process is interrupted.
        # The temporary file is created beside the destination so os.replace is
        # atomic on the same filesystem.
        temporary_path = None
        try:
            with tempfile.NamedTemporaryFile(
                mode="w", encoding="utf-8", dir=args.output.parent,
                prefix=f".{args.output.name}.", suffix=".tmp", delete=False,
            ) as temporary:
                temporary.write(rendered + "\n")
                temporary.flush()
                os.fsync(temporary.fileno())
                temporary_path = Path(temporary.name)
            os.replace(temporary_path, args.output)
            temporary_path = None
        finally:
            if temporary_path is not None:
                temporary_path.unlink(missing_ok=True)


if __name__ == "__main__":
    main()
