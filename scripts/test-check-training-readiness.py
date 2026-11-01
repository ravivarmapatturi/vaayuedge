"""Regression checks for the dependency-free training readiness report."""
import hashlib
import json
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
CHECKER = ROOT / "scripts/check-training-readiness.py"
ML_REQUIREMENTS = ROOT / "services/api/requirements-ml.txt"


def main() -> None:
    requirements = ML_REQUIREMENTS.read_text(encoding="utf-8")
    assert any(
        line.strip().startswith("lightning>=2.2,<3")
        for line in requirements.splitlines()
    ), "readiness checks Lightning but the ML environment must declare it"
    result = subprocess.run(
        [sys.executable, str(CHECKER)],
        cwd=ROOT, text=True, capture_output=True, check=True,
    )
    report = json.loads(result.stdout)
    assert report["evidence_class"].startswith("readiness diagnostic")
    assert report["gpu_gate"] in {"NOT READY", "REVIEW REQUIRED"}
    assert "lightning_importable" in report["checks"]
    assert report["checks"]["training_manifest"]["provided"] is False
    assert report["checks"]["license_audit"]["exists"] is True
    assert report["checks"]["license_audit"]["research_only_hold"] is True
    assert report["checks"]["license_audit"]["unresolved_holds"] == [
        "Bodhan gated access/terms and provenance",
        "Gemma upstream terms and provenance",
    ]
    assert "model license audit remains research-only" in report["blockers"]
    assert any("Bodhan gated access/terms" in blocker for blocker in report["blockers"])
    assert any("Gemma upstream terms" in blocker for blocker in report["blockers"])
    corpus_check = report["checks"]["corpus_inventory"]
    assert corpus_check["candidate_corpora_count"] == 2
    assert corpus_check["candidate_corpora_rights_clear"] is False
    assert "ai4bharat/BPCC" in corpus_check["unresolved_candidate_corpora"][1]["id"]
    assert any("candidate training corpus rights are unresolved" in blocker for blocker in report["blockers"])
    rights_audit = report["checks"]["corpus_rights_audit"]
    assert rights_audit["valid_json"] is True
    assert rights_audit["matches_inventory"] is True
    assert rights_audit["authoritative_rights_clear"] is False
    assert "BPCC artifact-rights audit remains unresolved" in report["blockers"]
    deployment_check = report["checks"]["deployment_preflight"]
    assert deployment_check["preflight_valid"] is True
    assert deployment_check["ready_for_local_bundle_benchmark"] is False
    assert set(deployment_check["missing_bundles"]) == {
        "whisper_cpp_binary", "whisper_cpp_model", "translation_model", "tts_model"
    }
    assert any("deployment bundles are missing" in blocker for blocker in report["blockers"])
    assert report["checks"]["candidate_inventory"]["candidate_entries_valid"] is True
    assert report["checks"]["candidate_inventory"]["candidate_ids_unique"] is True
    assert report["checks"]["candidate_inventory"]["candidate_count"] > 0

    output_path = ROOT / ".readiness-output-fixture.json"
    try:
        written = subprocess.run(
            [sys.executable, str(CHECKER), "--output", str(output_path)],
            cwd=ROOT, text=True, capture_output=True, check=True,
        )
        assert json.loads(output_path.read_text(encoding="utf-8")) == json.loads(written.stdout)
        assert not list(ROOT.glob(f".{output_path.name}.*.tmp"))
    finally:
        output_path.unlink(missing_ok=True)

    cleared_audit = ROOT / ".readiness-license-audit-fixture.md"
    cleared_audit.write_text("Status: cleared for documented scope.\n", encoding="utf-8")
    try:
        cleared = subprocess.run(
            [sys.executable, str(CHECKER), "--license-audit", str(cleared_audit)],
            cwd=ROOT, text=True, capture_output=True, check=True,
        )
        cleared_report = json.loads(cleared.stdout)
        assert cleared_report["checks"]["license_audit"]["research_only_hold"] is False
        assert cleared_report["checks"]["license_audit"]["unresolved_holds"] == []
        assert "model license audit remains research-only" not in cleared_report["blockers"]
    finally:
        cleared_audit.unlink(missing_ok=True)

    cleared_corpus = ROOT / ".readiness-corpus-inventory-fixture.json"
    cleared_corpus.write_text(json.dumps({"corpora": [{"id": "fixture", "role": "candidate_parallel_training", "license_status": "cleared"}]}), encoding="utf-8")
    try:
        cleared_corpus_result = subprocess.run(
            [sys.executable, str(CHECKER), "--corpus-inventory", str(cleared_corpus)],
            cwd=ROOT, text=True, capture_output=True, check=True,
        )
        cleared_corpus_report = json.loads(cleared_corpus_result.stdout)
        assert cleared_corpus_report["checks"]["corpus_inventory"]["candidate_corpora_rights_clear"] is True
        assert not any("candidate training corpus rights" in blocker for blocker in cleared_corpus_report["blockers"])
    finally:
        cleared_corpus.unlink(missing_ok=True)

    ready_preflight = ROOT / ".readiness-deployment-fixture.json"
    ready_preflight.write_text(json.dumps({
        "missing_bundles": [], "ready_for_local_bundle_benchmark": True
    }), encoding="utf-8")
    try:
        ready = subprocess.run(
            [sys.executable, str(CHECKER), "--deployment-preflight", str(ready_preflight)],
            cwd=ROOT, text=True, capture_output=True, check=True,
        )
        ready_report = json.loads(ready.stdout)
        ready_check = ready_report["checks"]["deployment_preflight"]
        assert ready_check["preflight_valid"] is True
        assert ready_check["ready_for_local_bundle_benchmark"] is True
        assert not any("deployment bundles are missing" in blocker for blocker in ready_report["blockers"])
    finally:
        ready_preflight.unlink(missing_ok=True)

    rights_fixture = ROOT / ".readiness-rights-fixture.json"
    rights_fixture.write_text(json.dumps({
        "repository": "ai4bharat/BPCC", "revision": "r" * 40,
        "hub_api": {"resolved_sha": "r" * 40},
        "artifact": {"path": "daily/tel_Telu.tsv", "oid": "o" * 40},
        "decision": "cleared", "training_status": "cleared",
    }), encoding="utf-8")
    try:
        rights = subprocess.run(
            [sys.executable, str(CHECKER), "--corpus-rights-audit", str(rights_fixture)],
            cwd=ROOT, text=True, capture_output=True, check=True,
        )
        rights_report = json.loads(rights.stdout)
        rights_check = rights_report["checks"]["corpus_rights_audit"]
        assert rights_check["valid_json"] is True
        assert rights_check["matches_inventory"] is False
        assert rights_check["authoritative_rights_clear"] is False
        assert any("does not match the pinned inventory" in blocker for blocker in rights_report["blockers"])
    finally:
        rights_fixture.unlink(missing_ok=True)

    fixture_splits = ROOT / ".readiness-manifest-fixture"
    fixture_splits.mkdir()
    fixture = fixture_splits / "manifest.json"
    for name in ("train", "validation", "test"):
        (fixture_splits / f"{name}.jsonl").write_text('{"source":"a","target":"b"}\n', encoding="utf-8")
    fixture_hashes = {
        name: hashlib.sha256((fixture_splits / f"{name}.jsonl").read_bytes()).hexdigest()
        for name in ("train", "validation", "test")
    }
    fixture.write_text(json.dumps({
        "input_sha256": "a" * 64,
        "splits": {
            name: {"rows": 1, "sha256": fixture_hashes[name]}
            for name in ("train", "validation", "test")
        }
    }), encoding="utf-8")
    try:
        valid = subprocess.run(
            [sys.executable, str(CHECKER), "--manifest", str(fixture)],
            cwd=ROOT, text=True, capture_output=True, check=True,
        )
        valid_report = json.loads(valid.stdout)
        manifest = valid_report["checks"]["training_manifest"]
        assert manifest["split_names_present"] is True
        assert manifest["split_entries_valid"] is True
        assert manifest["split_hashes_match"] is True
        if valid_report["checks"]["lightning_importable"]:
            assert "lightning is not installed" not in valid_report["blockers"]
        else:
            assert "lightning is not installed" in valid_report["blockers"]
        if valid_report["checks"]["sacrebleu_importable"]:
            assert "sacrebleu is not installed" not in valid_report["blockers"]
        else:
            assert "sacrebleu is not installed" in valid_report["blockers"]
    finally:
        for child in fixture_splits.iterdir():
            child.unlink()
        fixture_splits.rmdir()

    split_dir = ROOT / ".readiness-split-fixture"
    split_dir.mkdir()
    try:
        for name in ("train", "validation", "test"):
            (split_dir / f"{name}.jsonl").write_text('{"source":"a","target":"b"}\n', encoding="utf-8")
        hashes = {
            name: hashlib.sha256(
                (split_dir / f"{name}.jsonl").read_bytes()
            ).hexdigest()
            for name in ("train", "validation", "test")
        }
        (split_dir / "manifest.json").write_text(json.dumps({
            "counts": {"train": 1, "validation": 1, "test": 1},
            "input_sha256": "a" * 64,
            "split_sha256": hashes,
            "method": "test",
        }), encoding="utf-8")
        actual = subprocess.run(
            [sys.executable, str(CHECKER), "--manifest", str(split_dir / "manifest.json")],
            cwd=ROOT, text=True, capture_output=True, check=True,
        )
        actual_report = json.loads(actual.stdout)
        actual_manifest = actual_report["checks"]["training_manifest"]
        assert actual_manifest["schema"] == "counts"
        assert actual_manifest["split_files_present"] is True
        assert actual_manifest["actual_row_counts"] == {"train": 1, "validation": 1, "test": 1}
        assert actual_manifest["split_row_counts_match"] is True
        assert actual_manifest["split_hashes_present"] is True
        assert actual_manifest["split_hashes_match"] is True
        assert actual_manifest["split_entries_valid"] is True

        (split_dir / "manifest.json").write_text(json.dumps({
            "counts": {"train": 1, "validation": 1, "test": 1},
            "input_sha256": "z" * 64,
            "split_sha256": hashes,
            "method": "test",
        }), encoding="utf-8")
        malformed_input_hash = subprocess.run(
            [sys.executable, str(CHECKER), "--manifest", str(split_dir / "manifest.json")],
            cwd=ROOT, text=True, capture_output=True, check=True,
        )
        malformed_input_report = json.loads(malformed_input_hash.stdout)
        malformed_input_manifest = malformed_input_report["checks"]["training_manifest"]
        assert malformed_input_manifest["input_hash_present"] is False
        assert malformed_input_manifest["split_entries_valid"] is False

        (split_dir / "manifest.json").write_text(json.dumps({
            "counts": {"train": 1, "validation": 1, "test": 1},
            "input_sha256": "a" * 64,
            "split_sha256": {**hashes, "test": "g" * 64},
            "method": "test",
        }), encoding="utf-8")
        malformed_split_hash = subprocess.run(
            [sys.executable, str(CHECKER), "--manifest", str(split_dir / "manifest.json")],
            cwd=ROOT, text=True, capture_output=True, check=True,
        )
        malformed_split_report = json.loads(malformed_split_hash.stdout)
        malformed_split_manifest = malformed_split_report["checks"]["training_manifest"]
        assert malformed_split_manifest["split_hashes_present"] is True
        assert malformed_split_manifest["split_hashes_match"] is False
        assert malformed_split_manifest["split_entries_valid"] is False

        (split_dir / "manifest.json").write_text(json.dumps({
            "counts": {"train": 1, "validation": 1, "test": 1},
            "input_sha256": "a" * 64,
            "method": "test",
        }), encoding="utf-8")
        missing_hashes = subprocess.run(
            [sys.executable, str(CHECKER), "--manifest", str(split_dir / "manifest.json")],
            cwd=ROOT, text=True, capture_output=True, check=True,
        )
        missing_hashes_report = json.loads(missing_hashes.stdout)
        missing_hashes_manifest = missing_hashes_report["checks"]["training_manifest"]
        assert missing_hashes_manifest["split_hashes_present"] is False
        assert missing_hashes_manifest["split_hashes_match"] is False
        assert missing_hashes_manifest["split_entries_valid"] is False
        assert "hashes" in missing_hashes_report["blockers"][-1]

        (split_dir / "manifest.json").write_text(json.dumps({
            "counts": {"train": 2, "validation": 1, "test": 1},
            "input_sha256": "a" * 64,
            "split_sha256": hashes,
            "method": "test",
        }), encoding="utf-8")
        mismatch = subprocess.run(
            [sys.executable, str(CHECKER), "--manifest", str(split_dir / "manifest.json")],
            cwd=ROOT, text=True, capture_output=True, check=True,
        )
        mismatch_report = json.loads(mismatch.stdout)
        mismatch_manifest = mismatch_report["checks"]["training_manifest"]
        assert mismatch_manifest["split_row_counts_match"] is False
        assert mismatch_manifest["split_entries_valid"] is False
        assert "row counts" in mismatch_report["blockers"][-1]

        (split_dir / "manifest.json").write_text(json.dumps({
            "counts": {"train": 1, "validation": 1, "test": 1},
            "input_sha256": "a" * 64,
            "split_sha256": {**hashes, "test": "0" * 64},
            "method": "test",
        }), encoding="utf-8")
        hash_mismatch = subprocess.run(
            [sys.executable, str(CHECKER), "--manifest", str(split_dir / "manifest.json")],
            cwd=ROOT, text=True, capture_output=True, check=True,
        )
        hash_report = json.loads(hash_mismatch.stdout)
        hash_manifest = hash_report["checks"]["training_manifest"]
        assert hash_manifest["split_hashes_match"] is False
        assert hash_manifest["split_entries_valid"] is False

        (split_dir / "manifest.json").write_text(json.dumps({
            "counts": {"train": 0, "validation": 1, "test": 1},
            "input_sha256": "a" * 64,
            "split_sha256": hashes,
            "method": "test",
        }), encoding="utf-8")
        empty_train = subprocess.run(
            [sys.executable, str(CHECKER), "--manifest", str(split_dir / "manifest.json")],
            cwd=ROOT, text=True, capture_output=True, check=True,
        )
        empty_report = json.loads(empty_train.stdout)
        empty_manifest = empty_report["checks"]["training_manifest"]
        assert empty_manifest["split_entries_valid"] is False
        assert "row counts" in empty_report["blockers"][-1]
    finally:
        for child in split_dir.iterdir():
            child.unlink()
        split_dir.rmdir()
    inventory_fixture = ROOT / ".readiness-candidate-fixture.json"
    inventory_fixture.write_text(json.dumps({"candidates": [{}]}), encoding="utf-8")
    try:
        invalid_inventory = subprocess.run(
            [sys.executable, str(CHECKER), "--candidate-inventory", str(inventory_fixture)],
            cwd=ROOT, text=True, capture_output=True, check=True,
        )
        invalid_report = json.loads(invalid_inventory.stdout)
        inventory_check = invalid_report["checks"]["candidate_inventory"]
        assert inventory_check["candidate_count"] == 1
        assert inventory_check["candidate_entries_valid"] is False
        assert any("candidate inventory must contain" in blocker for blocker in invalid_report["blockers"])
    finally:
        inventory_fixture.unlink(missing_ok=True)
    duplicate_inventory = ROOT / ".readiness-duplicate-candidate-fixture.json"
    duplicate_inventory.write_text(json.dumps({
        "candidates": [{"id": "same", "role": "baseline"}, {"id": "same", "role": "student"}]
    }), encoding="utf-8")
    try:
        duplicate = subprocess.run(
            [sys.executable, str(CHECKER), "--candidate-inventory", str(duplicate_inventory)],
            cwd=ROOT, text=True, capture_output=True, check=True,
        )
        duplicate_report = json.loads(duplicate.stdout)
        duplicate_check = duplicate_report["checks"]["candidate_inventory"]
        assert duplicate_check["candidate_ids_unique"] is False
        assert duplicate_check["candidate_entries_valid"] is False
        assert any("candidate inventory must contain" in blocker for blocker in duplicate_report["blockers"])
    finally:
        duplicate_inventory.unlink(missing_ok=True)
    print("training readiness contract checks passed")


if __name__ == "__main__":
    main()
