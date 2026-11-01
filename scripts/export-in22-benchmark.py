#!/usr/bin/env python3
"""Export pinned IN22 test references for evaluation only."""
import argparse, hashlib, json, tarfile
from pathlib import Path

BENCHMARKS = {
    "in22-conv": ("ai4bharat/IN22-Conv", "18cd45870ff0a9e65df9b80dbbcc615eec0e489", "conv"),
    "in22-gen": ("ai4bharat/IN22-Gen", "e042ab3d3063110b1a85efa0a59bdbf8553bb928", "gen"),
}

def export_benchmark(output_dir: Path, local_archives: dict[str, Path]) -> dict:
    output_dir.mkdir(parents=True, exist_ok=False)
    manifest = {"evaluation_only": True, "benchmarks": {}}
    for name, (repo, revision, member_name) in BENCHMARKS.items():
        archive_path = local_archives.get(name)
        if archive_path is None:
            try:
                from huggingface_hub import hf_hub_download
            except ImportError as exc:
                raise SystemExit(
                    "huggingface_hub is required when --archive is not supplied"
                ) from exc
            archive_path = Path(hf_hub_download(
                repo, "IN22_benchmark.tar.gz", repo_type="dataset", revision=revision
            ))
        if not archive_path.is_file():
            raise FileNotFoundError(f"archive not found for {name}: {archive_path}")
        with tarfile.open(archive_path, "r:gz") as tar:
            source = tar.extractfile(f"IN22_benchmark/{member_name}/test.eng_Latn")
            target = tar.extractfile(f"IN22_benchmark/{member_name}/test.tel_Telu")
            if source is None or target is None:
                raise ValueError(f"missing test files in {repo}")
            sources = source.read().decode("utf-8").splitlines()
            targets = target.read().decode("utf-8").splitlines()
        if len(sources) != len(targets):
            raise ValueError(f"unaligned test files in {repo}: {len(sources)} != {len(targets)}")
        output = output_dir / f"{name}.jsonl"
        with output.open("x", encoding="utf-8") as handle:
            for index, (src, tgt) in enumerate(zip(sources, targets)):
                if not src.strip() or not tgt.strip():
                    raise ValueError(f"blank test row {index + 1} in {repo}")
                handle.write(json.dumps({"source": src, "target": tgt, "category": name}, ensure_ascii=False) + "\n")
        artifact_bytes = output.read_bytes()
        manifest["benchmarks"][name] = {
            "repo": repo, "revision": revision,
            "archive_sha256": hashlib.sha256(archive_path.read_bytes()).hexdigest(),
            "artifact": output.name,
            "artifact_bytes": len(artifact_bytes),
            "artifact_sha256": hashlib.sha256(artifact_bytes).hexdigest(),
            "rows": len(sources),
            "archive_source": "local" if name in local_archives else "huggingface_hub",
        }
    (output_dir / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return manifest


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("output_dir", type=Path)
    parser.add_argument(
        "--archive", action="append", metavar="NAME=PATH",
        help="use a local pinned archive for in22-conv or in22-gen; repeat twice to avoid network access",
    )
    args = parser.parse_args()
    local_archives = {}
    for item in args.archive or []:
        name, separator, path = item.partition("=")
        if not separator or name not in BENCHMARKS or not path:
            parser.error("--archive must be NAME=PATH where NAME is in22-conv or in22-gen")
        if name in local_archives:
            parser.error(f"duplicate --archive for {name}")
        local_archives[name] = Path(path)
    manifest = export_benchmark(args.output_dir, local_archives)
    print(json.dumps(manifest, ensure_ascii=False))

if __name__ == "__main__":
    main()
