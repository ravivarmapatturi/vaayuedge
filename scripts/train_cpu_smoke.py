"""Run a tiny CPU-only bitext training/checkpoint smoke test.

This is a pipeline test, not a translation model or a quality benchmark.  It
uses a character-level GRU so the data path and checkpoint recovery can be
validated without downloading a checkpoint or starting GPU compute.
"""
import argparse
import json
import pickle
import random
import os
from pathlib import Path

import torch
from torch import nn

# This runner is a deterministic, single-fixture contract test. Avoid paying
# host-sized thread-pool startup/oversubscription costs for its tiny tensors.
torch.set_num_threads(1)


SPECIAL = ["<pad>", "<bos>", "<eos>", "<unk>"]


def read_rows(path):
    with path.open(encoding="utf-8") as handle:
        for number, line in enumerate(handle, 1):
            if not line.strip():
                continue
            row = json.loads(line)
            if not isinstance(row.get("source"), str) or not row["source"].strip():
                raise ValueError(f"{path}:{number}: source must be nonempty")
            if not isinstance(row.get("target"), str) or not row["target"].strip():
                raise ValueError(f"{path}:{number}: target must be nonempty")
            yield row


class CharModel(nn.Module):
    def __init__(self, size, hidden=32):
        super().__init__()
        self.embedding = nn.Embedding(size, hidden)
        self.rnn = nn.GRU(hidden, hidden, batch_first=True)
        self.output = nn.Linear(hidden, size)

    def forward(self, tokens):
        encoded, _ = self.rnn(self.embedding(tokens))
        return self.output(encoded)


def encode(text, vocabulary):
    return [vocabulary["<bos>"]] + [vocabulary.get(char, vocabulary["<unk>"]) for char in text] + [vocabulary["<eos>"]]


def load_checkpoint(path, model, optimizer, vocabulary):
    """Load and validate a smoke checkpoint before mutating training state."""
    try:
        state = torch.load(path, map_location="cpu", weights_only=True)
        required = {"epoch", "model", "optimizer", "vocabulary", "provenance"}
        missing = required - set(state)
        if missing:
            raise ValueError(f"checkpoint missing fields: {', '.join(sorted(missing))}")
        if state["provenance"] != "CPU smoke fixture; no pretrained weights":
            raise ValueError("checkpoint provenance is not a CPU smoke fixture")
        if not isinstance(state["epoch"], int) or state["epoch"] < 1:
            raise ValueError("checkpoint epoch must be a positive integer")
        if state["vocabulary"] != vocabulary:
            raise ValueError("checkpoint vocabulary does not match input data")
        model.load_state_dict(state["model"])
        optimizer.load_state_dict(state["optimizer"])
        return state["epoch"]
    except (KeyError, TypeError, RuntimeError, EOFError, OSError, IndexError, pickle.UnpicklingError) as exc:
        raise ValueError(f"invalid CPU smoke checkpoint: {exc}") from exc


def save_checkpoint(path, state):
    """Write a checkpoint atomically so an interrupted save cannot corrupt resume state."""
    temporary = path.with_name(f".{path.name}.tmp-{os.getpid()}")
    try:
        torch.save(state, temporary)
        os.replace(temporary, path)
    finally:
        if temporary.exists():
            temporary.unlink()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("train", type=Path)
    parser.add_argument("validation", type=Path)
    parser.add_argument("checkpoint", type=Path)
    parser.add_argument("--epochs", type=int, default=2)
    parser.add_argument("--seed", type=int, default=17)
    args = parser.parse_args()
    if args.epochs < 1:
        raise ValueError("--epochs must be positive")
    random.seed(args.seed)
    torch.manual_seed(args.seed)
    train, validation = list(read_rows(args.train)), list(read_rows(args.validation))
    if not train or not validation:
        raise ValueError("train and validation files must each contain at least one row")
    args.checkpoint.parent.mkdir(parents=True, exist_ok=True)
    alphabet = sorted({c for row in train + validation for c in row["source"] + row["target"]})
    vocabulary = {token: i for i, token in enumerate(SPECIAL + alphabet)}
    model = CharModel(len(vocabulary))
    optimizer = torch.optim.AdamW(model.parameters(), lr=0.01)
    loss_fn = nn.CrossEntropyLoss(ignore_index=vocabulary["<pad>"])
    start_epoch = 0
    if args.checkpoint.exists():
        start_epoch = load_checkpoint(args.checkpoint, model, optimizer, vocabulary)
        if start_epoch >= args.epochs:
            raise ValueError(
                f"checkpoint already completed {start_epoch} epoch(s); "
                f"request a larger --epochs value than {start_epoch} to resume"
            )
    model.train()
    losses = []
    for epoch in range(start_epoch, args.epochs):
        for row in train:
            tokens = torch.tensor([encode(row["source"], vocabulary)], dtype=torch.long)
            labels = torch.tensor([encode(row["target"], vocabulary)], dtype=torch.long)
            width = max(tokens.shape[1], labels.shape[1])
            tokens = nn.functional.pad(tokens, (0, width - tokens.shape[1]), value=vocabulary["<pad>"])
            labels = nn.functional.pad(labels, (0, width - labels.shape[1]), value=vocabulary["<pad>"])
            optimizer.zero_grad()
            loss = loss_fn(model(tokens).transpose(1, 2), labels)
            loss.backward()
            optimizer.step()
            losses.append(float(loss.detach()))
        # Persist only after the full epoch completes.  The checkpoint epoch
        # is therefore an honest resume boundary; an interruption during an
        # epoch cannot be mistaken for completed work.
        save_checkpoint(args.checkpoint, {"epoch": epoch + 1, "model": model.state_dict(), "optimizer": optimizer.state_dict(), "vocabulary": vocabulary, "provenance": "CPU smoke fixture; no pretrained weights"})
    model.eval()
    with torch.no_grad():
        validation_loss = 0.0
        for row in validation:
            tokens = torch.tensor([encode(row["source"], vocabulary)], dtype=torch.long)
            labels = torch.tensor([encode(row["target"], vocabulary)], dtype=torch.long)
            width = max(tokens.shape[1], labels.shape[1])
            tokens = nn.functional.pad(tokens, (0, width - tokens.shape[1]), value=vocabulary["<pad>"])
            labels = nn.functional.pad(labels, (0, width - labels.shape[1]), value=vocabulary["<pad>"])
            validation_loss += float(loss_fn(model(tokens).transpose(1, 2), labels))
    print(json.dumps({"device": "cpu", "epochs_completed": args.epochs, "train_steps": len(losses), "last_train_loss": losses[-1], "validation_loss": validation_loss / len(validation), "checkpoint": str(args.checkpoint), "provenance": "smoke test only; no quality claim"}, sort_keys=True))


if __name__ == "__main__":
    main()
