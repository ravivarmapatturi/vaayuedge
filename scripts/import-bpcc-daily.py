"""Download pinned BPCC Telugu daily bitext on CPU; preserve attribution."""
import argparse
import csv
import hashlib
import json
from pathlib import Path

REPO = "ai4bharat/BPCC"
REVISION = "5bde309374f21c39e7c3d505f28ae11f58f2a220"
FILE = "daily/tel_Telu.tsv"


def main():
    from huggingface_hub import hf_hub_download
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    path = Path(hf_hub_download(REPO, FILE, repo_type="dataset", revision=REVISION))
    count = 0
    with path.open(encoding="utf-8", newline="") as handle, args.output.open("x", encoding="utf-8") as output:
        reader = csv.DictReader(handle, delimiter="\t")
        if reader.fieldnames != ["src_lang", "tgt_lang", "src", "tgt"]:
            raise ValueError("Unexpected BPCC schema")
        for row in reader:
            if row["src_lang"] != "eng_Latn" or row["tgt_lang"] != "tel_Telu":
                raise ValueError("Unexpected language direction")
            output.write(json.dumps({"source": row["src"], "target": row["tgt"],
                "provenance": f"{REPO}@{REVISION}/{FILE}",
                "license": "CC-BY-4.0", "attribution": "AI4Bharat BPCC-H-Daily; IndicTrans2 authors",
                "license_source": "https://github.com/AI4Bharat/IndicTrans2#license"}, ensure_ascii=False) + "\n")
            count += 1
    print(json.dumps({"rows": count, "source_sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
        "revision": REVISION, "output": str(args.output)}))


if __name__ == "__main__":
    main()
