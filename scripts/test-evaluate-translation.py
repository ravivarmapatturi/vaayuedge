#!/usr/bin/env python3
"""Dependency-free regression checks for evaluator input validation.

This intentionally does not exercise BLEU/chrF++ scoring.  It protects the
benchmark boundary while sacrebleu and model-generated predictions are not
available in the current environment.
"""

import importlib.util
import json
import subprocess
import sys
import tempfile
from pathlib import Path


SCRIPT = Path(__file__).with_name("evaluate-translation.py")
SPEC = importlib.util.spec_from_file_location("evaluate_translation", SCRIPT)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(MODULE)


def write(path, rows):
    path.write_text("".join(json.dumps(row, ensure_ascii=False) + "\n" for row in rows), encoding="utf-8")


def main():
    with tempfile.TemporaryDirectory(prefix="vaayuedge-evaluator-") as directory:
        root = Path(directory)
        references = root / "references.jsonl"
        predictions = root / "predictions.jsonl"
        write(references, [{"source": "  Hello   world ", "target": "హలో ప్రపంచం"}])
        write(predictions, [{"source": "hello world", "prediction": "హలో ప్రపంచం"}])

        refs = MODULE.read_rows(references, "target")
        hyps = MODULE.read_rows(predictions, "prediction")
        assert list(refs) == ["hello world"]
        assert set(refs) == set(hyps)
        reference_fingerprint = MODULE.file_fingerprint(references)
        assert reference_fingerprint["bytes"] == references.stat().st_size
        assert len(reference_fingerprint["sha256"]) == 64

        # The artifact path must be usable before scoring dependencies are
        # available; a complete run will populate it after sacrebleu loads.
        output_help = subprocess.run(
            [sys.executable, str(SCRIPT), "--help"],
            capture_output=True,
            text=True,
            check=False,
        )
        assert output_help.returncode == 0
        assert "--output" in output_help.stdout
        assert "--model-name" in output_help.stdout

        for argument in ("--model-name", "--pipeline-source"):
            blank_provenance = subprocess.run(
                [
                    sys.executable,
                    str(SCRIPT),
                    "--references",
                    str(references),
                    "--predictions",
                    str(predictions),
                    "--model-name",
                    "fixture-model" if argument != "--model-name" else " ",
                    "--pipeline-source",
                    "fixture-api" if argument != "--pipeline-source" else " \t",
                ],
                capture_output=True,
                text=True,
                check=False,
            )
            assert blank_provenance.returncode != 0
            assert "must be non-empty" in blank_provenance.stderr

        duplicate = root / "duplicate.jsonl"
        write(duplicate, [{"source": "Hello", "target": "x"}, {"source": " hello ", "target": "y"}])
        try:
            MODULE.read_rows(duplicate, "target")
        except ValueError as error:
            assert "duplicate normalized source" in str(error)
        else:
            raise AssertionError("duplicate normalized sources must fail closed")

        incomplete = root / "incomplete.jsonl"
        write(incomplete, [])
        loaded_incomplete = MODULE.read_rows(incomplete, "prediction")
        assert set(refs) - set(loaded_incomplete) == {"hello world"}

        blank_source = root / "blank-source.jsonl"
        write(blank_source, [{"source": " \t ", "target": "x"}])
        try:
            MODULE.read_rows(blank_source, "target")
        except ValueError as error:
            assert "non-empty source" in str(error)
        else:
            raise AssertionError("blank sources must fail closed")

        blank_target = root / "blank-target.jsonl"
        write(blank_target, [{"source": "hello", "target": " \t "}])
        try:
            MODULE.read_rows(blank_target, "target")
        except ValueError as error:
            assert "target" in str(error) and "non-empty" in str(error)
        else:
            raise AssertionError("blank reference targets must fail closed")

        blank_prediction = root / "blank-prediction.jsonl"
        write(blank_prediction, [{"source": "hello", "prediction": " \t "}])
        assert MODULE.read_rows(blank_prediction, "prediction", allow_empty_value=True)["hello"]["prediction"].isspace()

        malformed = root / "malformed.jsonl"
        malformed.write_text('{"source": "hello",\n', encoding="utf-8")
        try:
            MODULE.read_rows(malformed, "target")
        except ValueError as error:
            assert "invalid JSON" in str(error)
        else:
            raise AssertionError("malformed JSON must fail closed")

        mismatch_predictions = root / "mismatch-predictions.jsonl"
        write(mismatch_predictions, [])
        mismatch = subprocess.run(
            [
                sys.executable,
                str(SCRIPT),
                "--references",
                str(references),
                "--predictions",
                str(mismatch_predictions),
                "--model-name",
                "fixture-model",
                "--pipeline-source",
                "fixture-api",
            ],
            capture_output=True,
            text=True,
            check=False,
        )
        assert mismatch.returncode != 0
        assert "Coverage mismatch" in mismatch.stderr
        assert "sacrebleu" not in mismatch.stderr

        print("evaluator input validation checks passed; no scoring dependency or metric exercised")


if __name__ == "__main__":
    main()
