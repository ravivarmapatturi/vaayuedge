import Logo from '../ui/Logo';
import { NavTab } from './Navbar';

interface FooterProps {
  onSelectTab: (tab: NavTab) => void;
}

export default function Footer({ onSelectTab }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-canvas-100 border-t border-canvas-300/80 text-charcoal-700 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand column */}
        <div className="md:col-span-2 space-y-4">
          <Logo size="md" />
          <p className="text-sm text-charcoal-600 max-w-sm leading-relaxed">
            Private, lightweight, English-to-Telugu speech intelligence designed for laptops, mobile, and personal edge devices.
          </p>
          <div className="text-xs text-charcoal-500 space-y-1">
            <p><strong>Tagline:</strong> Less compute. More intelligence.</p>
            <p><strong>Primary Direction:</strong> English (`eng_Latn`) → Telugu (`tel_Telu`)</p>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-900 mb-3">Navigation</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <button onClick={() => onSelectTab('home')} className="hover:text-teal-700 transition">
                Home Overview
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('product')} className="hover:text-teal-700 transition">
                Product Capabilities
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('how-it-works')} className="hover:text-teal-700 transition">
                How It Works Pipeline
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('technology')} className="hover:text-teal-700 transition">
                Technology & Architecture
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('about')} className="hover:text-teal-700 transition">
                About the Project
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('docs')} className="hover:text-teal-700 transition">
                Documentation
              </button>
            </li>
          </ul>
        </div>

        {/* Technical Resources & Open Source */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-900 mb-3">Resources & Code</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="https://github.com/ravivarmapatturi/vayyuedge"
                target="_blank"
                rel="noreferrer"
                className="hover:text-teal-700 inline-flex items-center space-x-1 transition"
              >
                <span>GitHub Repository</span>
                <span className="text-xs">↗</span>
              </a>
            </li>
            <li>
              <button onClick={() => onSelectTab('docs')} className="hover:text-teal-700 transition text-left">
                Architecture Spec
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('technology')} className="hover:text-teal-700 transition text-left">
                Model Cards & Licenses
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('docs')} className="hover:text-teal-700 transition text-left">
                Privacy & Threat Model
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('docs')} className="hover:text-teal-700 transition text-left">
                Offline Benchmarks
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-canvas-300 flex flex-col sm:flex-row items-center justify-between text-xs text-charcoal-500 gap-3">
        <p>© {currentYear} VayyuEdge. Open-source under MIT License. Models retain respective upstream licenses.</p>
        <p className="flex items-center space-x-2">
          <span>Hosted on GitHub Pages</span>
          <span>·</span>
          <span>Target: <code className="bg-canvas-200 px-1 py-0.5 rounded text-[11px]">vayyuedge.neuralmasteryai.com</code></span>
        </p>
      </div>
    </footer>
  );
}
