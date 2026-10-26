import time
from typing import Optional
from app.adapters.base import BaseTranslationAdapter, TranslationResult


class OpusMTAdapter(BaseTranslationAdapter):
    """
    On-device English to Telugu translation adapter using Helsinki-NLP/opus-mt-en-dra
    with SafeTensors CPU inference. Fully open-source and ungated.
    """

    MODEL_ID = "Helsinki-NLP/opus-mt-en-dra"

    def __init__(self, device: str = "cpu"):
        self._device = device
        self._tokenizer = None
        self._model = None
        self._is_ready = True

    @property
    def name(self) -> str:
        return "opus_mt"

    @property
    def model_name(self) -> str:
        return self.MODEL_ID

    @property
    def is_ready(self) -> bool:
        return self._is_ready

    def load_model(self):
        """Lazy load tokenizer and model into CPU memory, preferring local cached weights."""
        if self._model is None or self._tokenizer is None:
            from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
            try:
                self._tokenizer = AutoTokenizer.from_pretrained(self.MODEL_ID, local_files_only=True)
                self._model = AutoModelForSeq2SeqLM.from_pretrained(
                    self.MODEL_ID,
                    use_safetensors=True,
                    local_files_only=True
                ).to(self._device)
            except Exception:
                self._tokenizer = AutoTokenizer.from_pretrained(self.MODEL_ID)
                self._model = AutoModelForSeq2SeqLM.from_pretrained(
                    self.MODEL_ID,
                    use_safetensors=True
                ).to(self._device)

    def translate(
        self,
        source_text: str,
        source_lang: str = "eng_Latn",
        target_lang: str = "tel_Telu"
    ) -> TranslationResult:
        clean_text = source_text.strip()
        if not clean_text:
            raise ValueError("Input text cannot be empty.")

        self.load_model()
        start_time = time.perf_counter()

        # Opus-MT en-dra expects target language token prefix '>>tel<<' for Telugu
        prefixed_input = f">>tel<< {clean_text}"

        inputs = self._tokenizer([prefixed_input], return_tensors="pt", padding=True).to(self._device)
        outputs = self._model.generate(
            **inputs,
            max_length=256,
            num_beams=3,
            early_stopping=True
        )

        translated = self._tokenizer.decode(outputs[0], skip_special_tokens=True).strip()
        inference_time_ms = round((time.perf_counter() - start_time) * 1000, 2)

        return TranslationResult(
            source_text=source_text,
            translated_text=translated,
            source_lang=source_lang,
            target_lang=target_lang,
            inference_time_ms=inference_time_ms,
            is_mock=False
        )
