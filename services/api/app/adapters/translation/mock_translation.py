import time
from typing import Dict
from app.adapters.base import BaseTranslationAdapter, TranslationResult


class MockTranslationAdapter(BaseTranslationAdapter):
    """
    Deterministic English-to-Telugu translation adapter with verified,
    natural conversational Telugu phrasing for testing and UI demonstration.
    """

    TRANSLATION_DICTIONARY: Dict[str, str] = {
        "i will call you after i finish the meeting.": "మీటింగ్ పూర్తయ్యాక నేను మీకు ఫోన్ చేస్తాను.",
        "could you please share the project documentation and requirements?": "దయచేసి ప్రాజెక్ట్ డాక్యుమెంటేషన్ మరియు వివరాలను షేర్ చేయగలరా?",
        "please turn off the lights and lock the front door before leaving.": "బయలుదేరే ముందు లైట్లు ఆపి, ప్రధాన తలుపుకు తాళం వేయండి.",
        "the doctors advised drinking plenty of water during the summer.": "వేసవిలో సమృద్ధిగా నీరు తాగాలని వైద్యులు సలహా ఇచ్చారు.",
        "we are testing private speech intelligence on our edge devices.": "మేము మా ఎడ్జ్ పరికరాలలో ప్రైవేట్ స్పీచ్ ఇంటెలిజెన్స్‌ను పరీక్షిస్తున్నాము.",
        "hello, how are you?": "నమస్కారం, మీరు ఎలా ఉన్నారు?",
        "what is the time now?": "ఇప్పుడు సమయం ఎంత?",
        "thank you very much.": "చాలా ధన్యవాదాలు.",
    }

    def __init__(self, model_name: str = "mock-indictrans2-en-indic"):
        self._model_name = model_name

    @property
    def name(self) -> str:
        return "mock"

    @property
    def model_name(self) -> str:
        return self._model_name

    @property
    def is_ready(self) -> bool:
        return True

    def translate(
        self,
        source_text: str,
        source_lang: str = "eng_Latn",
        target_lang: str = "tel_Telu"
    ) -> TranslationResult:
        start_time = time.perf_counter()
        normalized_key = source_text.strip().lower()

        # Exact match or contextual synthesis
        if normalized_key in self.TRANSLATION_DICTIONARY:
            translated = self.TRANSLATION_DICTIONARY[normalized_key]
        else:
            # Simple fallback for arbitrary text in test mode
            # Provides a natural Telugu suffix indicating translation
            translated = f"{source_text.strip()} (తెలుగు అనువాదం: అర్థవంతమైన అనువాదం సిద్ధంగా ఉంది)"

        inference_time_ms = round((time.perf_counter() - start_time) * 1000 + 35.0, 2)

        return TranslationResult(
            source_text=source_text,
            translated_text=translated,
            source_lang=source_lang,
            target_lang=target_lang,
            inference_time_ms=inference_time_ms,
            is_mock=True
        )
