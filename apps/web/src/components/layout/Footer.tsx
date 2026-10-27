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
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-900 mb-3">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="https://x.com/NeuralMastery" target="_blank" rel="noopener" className="hover:text-teal-700 inline-flex items-center space-x-1 transition">
                <span>X · @NeuralMastery</span>
                <span className="text-xs">↗</span>
              </a>
            </li>
            <li>
              <a href="../" className="hover:text-teal-700 transition">InferEdge AI</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-canvas-300 flex flex-col sm:flex-row items-center justify-between text-xs text-charcoal-500 gap-3">
        <p>© {currentYear} VaayuEdge, a product of <a href="../" className="underline hover:text-teal-700">InferEdge AI</a>. Models retain their respective upstream licenses.</p>
        <p><a href="https://x.com/NeuralMastery" target="_blank" rel="noopener" className="hover:text-teal-700">Contact us on X</a></p>
      </div>
    </footer>
  );
}
