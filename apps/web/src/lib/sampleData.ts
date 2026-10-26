export interface SampleItem {
  id: string;
  category: string;
  english: string;
  telugu: string;
  notes: string;
  estimatedDuration: number;
  audioUrl?: string;
}

export const VERIFIED_SAMPLES: SampleItem[] = [
  {
    id: 'sample-1',
    category: 'Work & Scheduling',
    english: 'I will call you after I finish the meeting.',
    telugu: 'మీటింగ్ పూర్తయ్యాక నేను మీకు ఫోన్ చేస్తాను.',
    notes: 'Preserves the conversational future tense and natural Telugu word order.',
    estimatedDuration: 4.05,
    audioUrl: './audio/samples/sample-1.wav',
  },
  {
    id: 'sample-2',
    category: 'Information Request',
    english: 'Could you please share the project documentation and requirements?',
    telugu: 'దయచేసి ప్రాజెక్ట్ డాక్యుమెంటేషన్ మరియు వివరాలను షేర్ చేయగలరా?',
    notes: 'Preserves polite question structure and domain terminology.',
    estimatedDuration: 5.70,
    audioUrl: './audio/samples/sample-2.wav',
  },
  {
    id: 'sample-3',
    category: 'Daily Instructions',
    english: 'Please turn off the lights and lock the front door before leaving.',
    telugu: 'బయలుదేరే ముందు లైట్లు ఆపి, ప్రధాన తలుపుకు తాళం వేయండి.',
    notes: 'Accurately sequences imperative clauses with natural Telugu conjunctive participle.',
    estimatedDuration: 5.68,
    audioUrl: './audio/samples/sample-3.wav',
  },
  {
    id: 'sample-4',
    category: 'Healthcare & Wellness',
    english: 'The doctors advised drinking plenty of water during the summer.',
    telugu: 'వేసవిలో సమృద్ధిగా నీరు తాగాలని వైద్యులు సలహా ఇచ్చారు.',
    notes: 'Preserves reported speech structure and advisory intent.',
    estimatedDuration: 5.86,
    audioUrl: './audio/samples/sample-4.wav',
  },
  {
    id: 'sample-5',
    category: 'Edge AI & Systems',
    english: 'We are testing private speech intelligence on our edge devices.',
    telugu: 'మేము మా ఎడ్జ్ పరికరాలలో ప్రైవేట్ స్పీచ్ ఇంటెలిజెన్స్‌ను పరీక్షిస్తున్నాము.',
    notes: 'Natural representation of edge computing concepts in Telugu typography.',
    estimatedDuration: 5.18,
    audioUrl: './audio/samples/sample-5.wav',
  },
];
