#!/usr/bin/env python3
"""Dependency-free regression checks for deployment preflight reporting."""

import importlib.util
import tempfile
from pathlib import Path

SCRIPT = Path(__file__).with_name("assess-deployment-feasibility.py")
spec = importlib.util.spec_from_file_location("deployment_preflight", SCRIPT)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


def main():
    with tempfile.TemporaryDirectory() as temp:
        root = Path(temp)
        (root / "models" / "translation").mkdir(parents=True)
        (root / "models" / "translation" / "weights.bin").write_bytes(b"1234")
        env = {"ASR_ADAPTER": "whisper_local", "TRANSLATION_ADAPTER": "opus_mt", "TTS_ADAPTER": "mock",
               "WHISPER_CPP_BINARY_PATH": "missing-whisper", "WHISPER_CPP_MODEL_PATH": "missing-model",
               "INDICTRANS2_MODEL_PATH": "models/translation", "TTS_MODEL_PATH": "missing-tts"}
        report = module.build_report(root, env)
        assert report["evidence_class"].startswith("deployment preflight")
        assert report["total_discovered_bytes"] == 4
        assert report["ready_for_local_bundle_benchmark"] is False
        assert set(report["missing_bundles"]) == {"whisper_cpp_binary", "whisper_cpp_model"}
        assert report["bundles"][2]["kind"] == "directory" and report["bundles"][2]["size_bytes"] == 4
        assert report["bundles"][2]["file_count"] == 1
        assert report["bundles"][2]["readable"] is True
        assert report["required_bundles"] == ["translation_model", "whisper_cpp_binary", "whisper_cpp_model"]
        mock_report = module.build_report(root, {"ASR_ADAPTER": "mock", "TRANSLATION_ADAPTER": "mock", "TTS_ADAPTER": "mock"})
        assert mock_report["required_bundles"] == []
        assert mock_report["missing_bundles"] == []
        assert mock_report["ready_for_local_bundle_benchmark"] is True
        empty_root = root / "empty"
        (empty_root / "models" / "translation").mkdir(parents=True)
        empty_report = module.build_report(empty_root, {
            "ASR_ADAPTER": "mock", "TRANSLATION_ADAPTER": "opus_mt", "TTS_ADAPTER": "mock",
            "INDICTRANS2_MODEL_PATH": "models/translation",
        })
        assert empty_report["ready_for_local_bundle_benchmark"] is False
        assert empty_report["missing_bundles"] == ["translation_model"]
    print("deployment feasibility checks passed")


if __name__ == "__main__":
    main()
