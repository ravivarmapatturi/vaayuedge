import { describe, it, expect } from 'vitest';
import { VERIFIED_SAMPLES } from '../lib/sampleData';

describe('VayyuEdge Verification Dataset & Content Integrity', () => {
  it('contains verified evaluation samples with valid English and Telugu pairings', () => {
    expect(VERIFIED_SAMPLES.length).toBeGreaterThanOrEqual(5);

    VERIFIED_SAMPLES.forEach((sample) => {
      expect(sample.id).toBeDefined();
      expect(sample.english.length).toBeGreaterThan(10);
      expect(sample.telugu.length).toBeGreaterThan(10);
      expect(sample.category).toBeDefined();
      expect(sample.notes).toBeDefined();
      // Ensure Telugu text contains actual Telugu Unicode script points (\u0c00-\u0c7f)
      expect(/[\u0C00-\u0C7F]/.test(sample.telugu)).toBe(true);
    });
  });

  it('contains the foundational schedule meeting sample', () => {
    const meetingSample = VERIFIED_SAMPLES.find((s) => s.id === 'sample-1');
    expect(meetingSample).toBeDefined();
    expect(meetingSample?.english).toBe('I will call you after I finish the meeting.');
    expect(meetingSample?.telugu).toBe('మీటింగ్ పూర్తయ్యాక నేను మీకు ఫోన్ చేస్తాను.');
  });
});
