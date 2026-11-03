import Logo from '../ui/Logo';
import { NavTab } from './Navbar';

interface FooterProps {
  onSelectTab: (tab: NavTab) => void;
}

export default function Footer({ onSelectTab }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const handleTabClick = (tab: NavTab) => {
    onSelectTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-canvas-100 border-t border-canvas-300 text-charcoal-700 py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & positioning */}
          <div className="md:col-span-2 space-y-3">
            <Logo size="md" />
            <p className="text-sm text-charcoal-700 max-w-sm leading-relaxed">
              On-device speech and translation, starting with English and Telugu. Today, speak English, review the translation and hear Telugu. Telugu to English is in development.
            </p>
            <p className="text-xs text-charcoal-500 font-mono">
              Models run locally in your browser. Files stay on your device.
            </p>
          </div>

          {/* VaayuEdge Navigation */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-charcoal-900 mb-3 font-mono">
              VaayuEdge
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => handleTabClick('home')}
                  className="text-charcoal-700 hover:text-teal-800 transition-colors"
                >
                  Try it
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleTabClick('how-it-works')}
                  className="text-charcoal-700 hover:text-teal-800 transition-colors"
                >
                  How it works
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleTabClick('about')}
                  className="text-charcoal-700 hover:text-teal-800 transition-colors"
                >
                  About
                </button>
              </li>
            </ul>
          </div>

          {/* InferEdge AI & Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-charcoal-900 mb-3 font-mono">
              InferEdge AI
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="text-charcoal-700 hover:text-teal-800 transition-colors">
                  Company home
                </a>
              </li>
              <li>
                <a href="/leaderboard/" className="text-charcoal-700 hover:text-teal-800 transition-colors">
                  Leaderboard
                </a>
              </li>
              <li>
                <a href="/research/" className="text-charcoal-700 hover:text-teal-800 transition-colors">
                  Research
                </a>
              </li>
              <li>
                <a href="/edge-ai/" className="text-charcoal-700 hover:text-teal-800 transition-colors">
                  Edge AI guide
                </a>
              </li>
              <li>
                <a href="/english-to-telugu/" className="text-charcoal-700 hover:text-teal-800 transition-colors">
                  English to Telugu
                </a>
              </li>
              <li className="pt-2">
                <a
                  href="https://x.com/NeuralMastery"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-charcoal-900 hover:text-teal-800 font-medium inline-flex items-center gap-1 transition-colors"
                >
                  <span>Contact on X (@NeuralMastery)</span>
                  <span aria-hidden="true" className="text-xs">↗</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-canvas-300 flex flex-col sm:flex-row items-baseline justify-between text-xs text-charcoal-500 gap-2">
          <p>© {currentYear} VaayuEdge, a product of InferEdge AI. Upstream models retain their respective licences.</p>
          <p className="font-mono text-charcoal-500">On-device mode keeps audio on your device.</p>
        </div>
      </div>
    </footer>
  );
}
