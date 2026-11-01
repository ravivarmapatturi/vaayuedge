"""Validate the configuration boundary for a future attributed training run.

This is a dependency-free contract check.  It validates configuration and the
training manifest without importing Lightning, loading a model, or allocating
GPU memory.  Passing this check is not training readiness or model evidence.
"""
import argparse
import hashlib
import json
from pathlib import Path


REQUIRED = {"manifest", "candidate_id", "candidate_inventory", "seed", "max_source_chars", "max_target_chars", "checkpoint_dir"}
MAX_TEXT_CHARS = 4096


def is_sha256(value: object) -> bool:
    """Return whether value is a 64-character hexadecimal SHA-256 digest."""
    if not isinstance(value, str) or len(value) != 64:
        return False
    try:
        int(value, 16)
    except ValueError:
        return False
    return True


def validate(config_path: Path) -> dict:
    payload = json.loads(config_path.read_text(encoding="utf-8"))
    if not isinstance(payload, dict):
        raise ValueError("training contract must be a JSON object")
    missing = sorted(REQUIRED - set(payload))
    if missing:
        raise ValueError(f"missing training contract fields: {', '.join(missing)}")
    if not isinstance(payload["candidate_id"], str) or not payload["candidate_id"].strip():
        raise ValueError("candidate_id must be nonempty")
    inventory = Path(payload["candidate_inventory"])
    if inventory.is_absolute():
        raise ValueError("candidate_inventory must be relative to the contract file")
    if ".." in inventory.parts:
        raise ValueError("candidate_inventory must not escape the contract directory")
    inventory = config_path.parent / inventory
    try:
        inventory_payload = json.loads(inventory.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"candidate inventory is missing or invalid: {inventory}") from exc
    candidates = inventory_payload.get("candidates") if isinstance(inventory_payload, dict) else None
    if not isinstance(candidates, list):
        raise ValueError("candidate inventory must contain a candidates list")
    candidate_ids = []
    for candidate in candidates:
        if (
            not isinstance(candidate, dict)
            or not isinstance(candidate.get("id"), str)
            or not candidate["id"].strip()
            or not isinstance(candidate.get("role"), str)
            or not candidate["role"].strip()
        ):
            raise ValueError("candidate inventory entries must contain non-empty id and role")
        candidate_ids.append(candidate["id"].strip())
    if not candidate_ids:
        raise ValueError("candidate inventory must contain at least one candidate")
    if len(candidate_ids) != len(set(candidate_ids)):
        raise ValueError("candidate inventory IDs must be unique")
    if payload["candidate_id"].strip() not in candidate_ids:
        raise ValueError("candidate_id is not registered in candidate_inventory")
    if isinstance(payload["seed"], bool) or not isinstance(payload["seed"], int) or payload["seed"] < 0:
        raise ValueError("seed must be a nonnegative integer")
    for field in ("max_source_chars", "max_target_chars"):
        value = payload[field]
        if isinstance(value, bool) or not isinstance(value, int) or not 1 <= value <= MAX_TEXT_CHARS:
            raise ValueError(f"{field} must be an integer from 1 to {MAX_TEXT_CHARS}")
    for forbidden in ("accelerator", "devices", "gpu", "gpu_count"):
        if forbidden in payload and payload[forbidden] not in (None, False, 0, "cpu"):
            raise ValueError(f"{forbidden} must remain unset/CPU before the GPU gate opens")
    manifest = Path(payload["manifest"])
    if manifest.is_absolute():
        raise ValueError("manifest must be relative to the contract file")
    if ".." in manifest.parts:
        raise ValueError("manifest must not escape the contract directory")
    manifest = config_path.parent / manifest
    if not manifest.is_file():
        raise ValueError(f"training manifest does not exist: {manifest}")
    manifest_payload = json.loads(manifest.read_text(encoding="utf-8"))
    if not isinstance(manifest_payload.get("counts"), dict):
        raise ValueError("training manifest must contain counts")
    input_hash = manifest_payload.get("input_sha256")
    if not is_sha256(input_hash):
        raise ValueError("training manifest must contain a 64-character hexadecimal input_sha256")
    expected = {"train", "validation", "test"}
    if set(manifest_payload["counts"]) < expected:
        raise ValueError("training manifest must contain train/validation/test counts")
    if any(not isinstance(manifest_payload["counts"][name], int) or manifest_payload["counts"][name] < 1 for name in expected):
        raise ValueError("training manifest split counts must be positive integers")
    declared_hashes = manifest_payload.get("split_sha256")
    if not isinstance(declared_hashes, dict) or not expected <= set(declared_hashes):
        raise ValueError("training manifest must contain train/validation/test split_sha256 values")
    split_counts = {}
    split_hashes = {}
    for name in ("train", "validation", "test"):
        split_path = manifest.parent / f"{name}.jsonl"
        if not split_path.is_file():
            raise ValueError(f"training manifest split is missing: {split_path}")
        declared_hash = declared_hashes[name]
        if not is_sha256(declared_hash):
            raise ValueError(f"training manifest hash is malformed for {name}")
        actual_hash = hashlib.sha256(split_path.read_bytes()).hexdigest()
        if actual_hash != declared_hash:
            raise ValueError(f"training manifest hash mismatch for {name}")
        with split_path.open(encoding="utf-8") as split_file:
            actual_count = sum(1 for line in split_file if line.strip())
        if actual_count != manifest_payload["counts"][name]:
            raise ValueError(f"training manifest row mismatch for {name}")
        split_counts[name] = actual_count
        split_hashes[name] = actual_hash
    if not isinstance(payload["checkpoint_dir"], str) or not payload["checkpoint_dir"].strip():
        raise ValueError("checkpoint_dir must be a non-empty relative path")
    checkpoint_dir = Path(payload["checkpoint_dir"])
    if checkpoint_dir.is_absolute():
        raise ValueError("checkpoint_dir must be relative to the contract file")
    if ".." in checkpoint_dir.parts:
        raise ValueError("checkpoint_dir must not escape the contract directory")
    if checkpoint_dir == Path("."):
        raise ValueError("checkpoint_dir must name a dedicated checkpoint directory")
    return {
        "candidate_id": payload["candidate_id"],
        "candidate_inventory": str(inventory),
        "manifest": str(manifest),
        "split_counts": split_counts,
        "split_sha256": split_hashes,
        "input_sha256": input_hash,
        "seed": payload["seed"],
        "max_source_chars": payload["max_source_chars"],
        "max_target_chars": payload["max_target_chars"],
        "checkpoint_dir": str(checkpoint_dir),
        "evidence_class": "training contract validation; no training or quality claim",
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("config", type=Path)
    args = parser.parse_args()
    print(json.dumps(validate(args.config), sort_keys=True))


if __name__ == "__main__":
    main()
