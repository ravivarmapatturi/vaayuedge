export interface SampleItem {
  id: string;
  category: string;
  english: string;
  telugu: string;
  notes: string;
  estimatedDuration: number;
}

export const VERIFIED_SAMPLES: SampleItem[] = [
  {
    id: 'sample-1',
    category: 'Work & Scheduling',
    english: 'I will call you after I finish the meeting.',
    telugu: 'మీటింగ్ పూర్తయ్యాక నేను మీకు ఫోన్ చేస్తాను.',
    notes: 'Preserves the conversational future tense and natural Telugu word order.',
    estimatedDuration: 3.2,
  },
  {
    id: 'sample-2',
    category: 'Information Request',
    english: 'Could you please share the project documentation and requirements?',
    telugu: 'దయచేసి ప్రాజెక్ట్ డాక్యుమెంటేషన్ మరియు వివరాలను షేర్ చేయగలరా?',
    notes: 'Preserves polite question structure and domain terminology.',
    estimatedDuration: 4.1,
  },
  {
    id: 'sample-3',
    category: 'Daily Instructions',
    english: 'Please turn off the lights and lock the front door before leaving.',
    telugu: 'బయలుదేరే ముందు లైట్లు ఆపి, ప్రధాన తలుపుకు తాళం వేయండి.',
    notes: 'Accurately sequences imperative clauses with natural Telugu conjunctive participle.',
    estimatedDuration: 4.5,
  },
  {
    id: 'sample-4',
    category: 'Healthcare & Wellness',
    english: 'The doctors advised drinking plenty of water during the summer.',
    telugu: 'వేసవిలో సమృద్ధిగా నీరు తాగాలని వైద్యులు సలహా ఇచ్చారు.',
    notes: 'Preserves reported speech structure and advisory intent.',
    estimatedDuration: 3.8,
  },
  {
    id: 'sample-5',
    category: 'Edge AI & Systems',
    english: 'We are testing private speech intelligence on our edge devices.',
    telugu: 'మేము మా ఎడ్జ్ పరికరాలలో ప్రైవేట్ స్పీచ్ ఇంటెలిజెన్స్‌ను పరీక్షిస్తున్నాము.',
    notes: 'Natural representation of edge computing concepts in Telugu typography.',
    estimatedDuration: 4.0,
  },
];
