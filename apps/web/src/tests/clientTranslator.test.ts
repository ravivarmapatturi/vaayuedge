import { describe, it, expect } from 'vitest';
import { translateClientSide } from '../lib/clientTranslator';

describe('clientTranslator', () => {
  it('translates common greetings directly', () => {
    const res1 = translateClientSide('Good morning');
    expect(res1.translated_text).toBe('శుభోదయం');

    const res2 = translateClientSide('Thank you');
    expect(res2.translated_text).toBe('ధన్యవాదాలు');

    const res3 = translateClientSide('Hello');
    expect(res3.translated_text).toBe('నమస్కారం');
  });

  it('translates conversational future intent sentence pattern', () => {
    const res = translateClientSide('I will call you after the meeting');
    expect(res.translated_text).toContain('మీటింగ్');
    expect(res.translated_text).toContain('ఫోన్ చేస్తాను');
  });

  it('translates everyday words and questions into Telugu characters', () => {
    const res = translateClientSide('Where are you going?');
    expect(res.translated_text).toContain('మీరు');
    expect(/[\u0C00-\u0C7F]/.test(res.translated_text)).toBe(true);
  });
});
