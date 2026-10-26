import { useState } from 'react';
import Logo from '../ui/Logo';

export type NavTab = 'home' | 'product' | 'how-it-works' | 'technology' | 'about' | 'docs';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onExploreDemo: () => void;
  processingMode?: 'local' | 'remote';
  isConnected?: boolean;
}

export default function Navbar({
  currentTab,
  onSelectTab,
  onExploreDemo,
  processingMode: _processingMode = 'local',
  isConnected = false,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavTab; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'product', label: 'Product' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'technology', label: 'Technology' },
    { id: 'about', label: 'About' },
    { id: 'docs', label: 'Docs' },
  ];

  const handleNavClick = (tab: NavTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-30 bg-canvas-50/95 backdrop-blur-md border-b border-canvas-300/70 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded-lg"
          aria-label="VayyuEdge Home"
        >
          <Logo size="md" />
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2" aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                currentTab === item.id
                  ? 'text-teal-800 bg-teal-50 font-semibold'
                  : 'text-charcoal-700 hover:text-charcoal-900 hover:bg-canvas-200/60'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Action & Mode Badge */}
        <div className="hidden sm:flex items-center space-x-3">
          <div
            className={`flex items-center space-x-1.5 text-[11px] px-2.5 py-1 rounded-full border ${
              isConnected
                ? 'border-emerald-200/80 bg-emerald-50/90 text-emerald-800'
                : 'border-teal-200/80 bg-teal-50/90 text-teal-800'
            }`}
            title={isConnected ? 'On-Device AI Engine Active (127.0.0.1:8000)' : 'Interactive Web Preview'}
          >
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-teal-500'}`}></span>
            <span className="font-medium">
              {isConnected ? 'On-Device Engine Active' : 'Interactive Preview'}
            </span>
          </div>

          <button
            onClick={onExploreDemo}
            className="px-4 py-2 bg-charcoal-900 hover:bg-charcoal-800 text-white rounded-lg text-xs font-semibold shadow-subtle hover:shadow transition-all"
          >
            Explore Prototype
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex sm:hidden items-center space-x-2">
          <button
            onClick={onExploreDemo}
            className="px-3 py-1.5 bg-charcoal-900 text-white rounded-lg text-xs font-semibold"
          >
            Demo
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-charcoal-700 hover:text-charcoal-900 rounded-lg hover:bg-canvas-200 focus:outline-none"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-canvas-300 bg-canvas-50 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
                currentTab === item.id
                  ? 'bg-teal-50 text-teal-800 font-semibold'
                  : 'text-charcoal-700 hover:bg-canvas-200/80'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-3 border-t border-canvas-200 mt-2 flex items-center justify-between text-xs text-charcoal-500">
            <span>Processing mode:</span>
            <span className="font-medium text-teal-700">On-Device Edge</span>
          </div>
        </div>
      )}
    </header>
  );
}
