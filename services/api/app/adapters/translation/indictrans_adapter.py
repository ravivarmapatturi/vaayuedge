import os
import time
from typing import Optional
from app.adapters.base import BaseTranslationAdapter, TranslationResult


class IndicTrans2Adapter(BaseTranslationAdapter):
    """
    Adapter for AI4Bharat IndicTrans2 English -> Telugu translation engine.
    Uses 'eng_Latn' as source and 'tel_Telu' as target language codes.
    """

    def __init__(self, model_path: str, device: str = "cpu"):
        self._model_path = model_path
        self._device = device
        self._model = None
        self._tokenizer = None

    @property
    def name(self) -> str:
        return "indictrans2"

    @property
    def model_name(self) -> str:
        return "ai4bharat/indictrans2-en-indic-1B"

    @property
    def is_ready(self) -> bool:
        # Check if local model weights directory or file exists
        return os.path.exists(self._model_path)

    def load_model(self):
        """Lazy loader for IndicTrans2 weights when dependencies and files exist."""
        if not self.is_ready:
            raise FileNotFoundError(
                f"IndicTrans2 weights not found at '{self._model_path}'. "
                "Download weights using scripts/download-models.py"
            )
        # Attempt importing transformers or ctranslate2
        try:
            from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
            self._tokenizer = AutoTokenizer.from_pretrained(self._model_path, trust_remote_code=True)
            self._model = AutoModelForSeq2SeqLM.from_pretrained(self._model_path, trust_remote_code=True).to(self._device)
        except Exception as e:
            raise RuntimeError(f"Failed to load IndicTrans2 model: {str(e)}")

    def translate(
        self,
        source_text: str,
        source_lang: str = "eng_Latn",
        target_lang: str = "tel_Telu"
    ) -> TranslationResult:
        if not self.is_ready:
            raise RuntimeError(
                f"IndicTrans2 model path '{self._model_path}' not present. "
                "Run scripts/download-models.py or switch TRANSLATION_ADAPTER to 'mock'."
            )

        if self._model is None:
            self.load_model()

        start_time = time.perf_counter()

        # Batch encode and generate
        inputs = self._tokenizer([source_text], return_tensors="pt", padding=True).to(self._device)
        generated_tokens = self._model.generate(
            **inputs,
            use_cache=True,
            num_beams=4,
            max_length=256
        )
        translated_text = self._tokenizer.batch_decode(
            generated_tokens,
            skip_special_tokens=True
        )[0]

        inference_time_ms = round((time.perf_counter() - start_time) * 1000, 2)

        return TranslationResult(
            source_text=source_text,
            translated_text=translated_text.strip(),
            source_lang=source_lang,
            target_lang=target_lang,
            inference_time_ms=inference_time_ms,
            is_mock=False
        )
