import InteractiveDemo from '../components/demo/InteractiveDemo';
import { NavTab } from '../components/layout/Navbar';

interface HomePageProps {
  onSelectTab: (tab: NavTab) => void;
}

// Sizes are the quantized files the browser worker loads, read from their Hugging Face listings on 3 Nov 2026.
const PARTS = [
  { step: 'Listen', detail: 'Turns English speech into text you can edit.', size: '77 MB' },
  { step: 'Translate', detail: 'Turns the reviewed English into Telugu.', size: '412 MB' },
  { step: 'Speak', detail: 'Reads the Telugu aloud.', size: '114 MB' },
];

const LIMITS = [
  'Translation quality is well behind larger models. Check anything important with a Telugu speaker.',
  'Setup downloads about 600 MB, which is large for a phone or a limited data plan.',
  'Telugu to English, and Telugu speech input, are in development and not available yet.',
  'The voice model licence does not allow commercial use, so it will be replaced before any paid version.',
];

export default function HomePage({ onSelectTab }: HomePageProps) {
  return (
    <div className="pb-16">
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-5 sm:pt-7 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-charcoal-900">
          Speech and translation that run on your device.
        </h1>
        <p className="mt-1.5 max-w-3xl text-sm sm:text-base text-charcoal-700">
          Starting with English and Telugu. Today, speak English, review the translation and hear Telugu. After one setup, it also works offline.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <InteractiveDemo id="demo-workspace" />
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 mt-14" aria-labelledby="how-heading">
        <h2 id="how-heading" className="text-xl font-bold text-charcoal-900">What runs on your device</h2>
        <ol className="mt-4 border-t border-canvas-300">
          {PARTS.map((part, index) => (
            <li key={part.step} className="grid grid-cols-[2rem_1fr_auto] gap-3 py-3.5 border-b border-canvas-300 items-baseline">
              <span className="font-mono text-sm text-charcoal-500">{index + 1}</span>
              <span><strong className="text-charcoal-900">{part.step}.</strong> <span className="text-charcoal-700">{part.detail}</span></span>
              <span className="font-mono text-sm text-charcoal-700 whitespace-nowrap">{part.size}</span>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-sm text-charcoal-700">
          Files stay on your device after setup. <button type="button" onClick={() => onSelectTab('how-it-works')} className="text-teal-800 underline">How it works</button>
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 mt-14" aria-labelledby="limits-heading">
        <h2 id="limits-heading" className="text-xl font-bold text-charcoal-900">Current limits</h2>
        <ul className="mt-3 space-y-2 list-disc pl-5 text-charcoal-700">
          {LIMITS.map((limit) => <li key={limit}>{limit}</li>)}
        </ul>
        <p className="mt-5 text-sm text-charcoal-700">
          <a href="/leaderboard/" className="text-teal-800 underline">See how small models compare, and where ours stands</a>
          {' · '}
          <a href="/research/" className="text-teal-800 underline">Read the research</a>
        </p>
      </section>
    </div>
  );
}
