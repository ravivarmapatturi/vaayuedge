#!/usr/bin/env python3
import json
import subprocess
import sys
import tempfile
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
SCRIPT = ROOT / "scripts" / "validate-human-review.py"


def run(predictions, reviews):
    with tempfile.TemporaryDirectory() as directory:
        directory = Path(directory)
        prediction_path = directory / "predictions.jsonl"
        review_path = directory / "reviews.jsonl"
        prediction_path.write_text("\n".join(json.dumps(row) for row in predictions) + "\n")
        review_path.write_text("\n".join(json.dumps(row) for row in reviews) + "\n")
        return subprocess.run([sys.executable, str(SCRIPT), "--predictions", str(prediction_path), "--reviews", str(review_path)], text=True, capture_output=True)


def main():
    predictions = [{"source": "Hello"}, {"source": "How are you?"}]
    reviews = [
        {"source": "hello", "reviewer_id": "r1", "rating": 4},
        {"source": "How are you?", "reviewer_id": "r2", "rating": 5},
    ]
    result = run(predictions, reviews)
    assert result.returncode == 0, result.stderr
    report = json.loads(result.stdout)
    assert report["mean_rating"] == 4.5 and report["reviewer_count"] == 2
    result = run(predictions, reviews[:1])
    assert result.returncode != 0 and "coverage mismatch" in result.stderr.lower()
    invalid = [{"source": "Hello", "reviewer_id": "r1", "rating": 6}, {"source": "How are you?", "reviewer_id": "r2", "rating": 5}]
    result = run(predictions, invalid)
    assert result.returncode != 0 and "rating" in result.stderr.lower()
    with tempfile.TemporaryDirectory() as directory:
        directory = Path(directory)
        prediction_path = directory / "malformed-predictions.jsonl"
        review_path = directory / "reviews.jsonl"
        prediction_path.write_text('{"source": "Hello"\n', encoding="utf-8")
        review_path.write_text(json.dumps(reviews[0]) + "\n", encoding="utf-8")
        malformed = subprocess.run(
            [sys.executable, str(SCRIPT), "--predictions", str(prediction_path), "--reviews", str(review_path)],
            text=True, capture_output=True,
        )
        assert malformed.returncode != 0
        assert "invalid JSON" in malformed.stderr
        assert "malformed-predictions.jsonl:1" in malformed.stderr
    print("human review validation checks passed")


if __name__ == "__main__":
    main()
