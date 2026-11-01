#!/usr/bin/env python3
"""Validate and summarize blinded translation human-review JSONL.

Each row must contain a normalized-source-compatible ``source``, a numeric
``rating`` from 1 through 5, and a non-empty ``reviewer_id``.  This tool only
validates supplied judgments; it does not create ratings or claim reviewer
fluency, agreement, or statistical significance.
"""

import argparse
import json
import statistics
import unicodedata
from pathlib import Path


def normalize(text):
    return " ".join(unicodedata.normalize("NFKC", text).casefold().split())


def read_sources(path):
    rows = {}
    for number, line in enumerate(path.open(encoding="utf-8"), 1):
        try:
            row = json.loads(line)
        except json.JSONDecodeError as exc:
            raise ValueError(f"{path}:{number}: invalid JSON: {exc.msg}") from exc
        if not isinstance(row, dict) or not isinstance(row.get("source"), str) or not row["source"].strip():
            raise ValueError(f"{path}:{number}: expected non-empty source")
        key = normalize(row["source"])
        if key in rows:
            raise ValueError(f"{path}:{number}: duplicate normalized source")
        rows[key] = row
    return rows


def read_reviews(path):
    rows = {}
    for number, line in enumerate(path.open(encoding="utf-8"), 1):
        try:
            row = json.loads(line)
        except json.JSONDecodeError as exc:
            raise ValueError(f"{path}:{number}: invalid JSON: {exc.msg}") from exc
        if not isinstance(row, dict) or not isinstance(row.get("source"), str) or not row["source"].strip():
            raise ValueError(f"{path}:{number}: expected non-empty source")
        key = normalize(row["source"])
        if key in rows:
            raise ValueError(f"{path}:{number}: duplicate normalized source")
        reviewer = row.get("reviewer_id")
        if not isinstance(reviewer, str) or not reviewer.strip():
            raise ValueError(f"{path}:{number}: reviewer_id must be non-empty")
        rating = row.get("rating")
        if isinstance(rating, bool) or not isinstance(rating, (int, float)) or not 1 <= rating <= 5:
            raise ValueError(f"{path}:{number}: rating must be a number from 1 through 5")
        rows[key] = row
    return rows


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--predictions", type=Path, required=True)
    parser.add_argument("--reviews", type=Path, required=True)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    predictions = read_sources(args.predictions)
    reviews = read_reviews(args.reviews)
    missing = sorted(set(predictions) - set(reviews))
    extra = sorted(set(reviews) - set(predictions))
    if missing or extra:
        raise SystemExit(f"Review coverage mismatch: {len(missing)} missing and {len(extra)} extra reviews")
    ratings = [reviews[key]["rating"] for key in predictions]
    report = {
        "reviewer_count": len({reviews[key]["reviewer_id"] for key in predictions}),
        "reviewed_rows": len(ratings),
        "mean_rating": statistics.fmean(ratings),
        "rating_counts": {str(rating): sum(value == rating for value in ratings) for rating in range(1, 6)},
        "coverage_complete": True,
        "evidence_class": "measured human-review summary",
        "ratings_are_supplied_judgments": True,
    }
    rendered = json.dumps(report, indent=2) + "\n"
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(rendered, encoding="utf-8")
    print(rendered, end="")


if __name__ == "__main__":
    main()
