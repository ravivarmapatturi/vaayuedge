import { useState } from 'react';
import Logo from '../ui/Logo';

export type NavTab = 'home' | 'product' | 'how-it-works' | 'technology' | 'research' | 'about';

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
    { id: 'home', label: 'Try it' },
    { id: 'how-it-works', label: 'How it works' },
    { id: 'about', label: 'About' },
  ];

  const handleNavClick = (tab: NavTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-30 bg-canvas-50/95 backdrop-blur-sm border-b border-canvas-300 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 rounded-md"
            aria-label="VaayuEdge Home"
          >
            <Logo size="md" />
          </button>
          <a
            href="/"
            className="hidden sm:inline-block text-xs font-mono text-charcoal-500 hover:text-teal-800 border-l border-canvas-300 pl-3 transition-colors"
            title="InferEdge AI company home"
          >
            by InferEdge AI
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-1.5" aria-label="Main navigation">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                  isActive
                    ? 'text-charcoal-900 bg-canvas-200/80 font-semibold'
                    : 'text-charcoal-700 hover:text-charcoal-900 hover:bg-canvas-200/40'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <a
            href="/leaderboard/"
            className="px-3 py-1.5 text-sm font-medium text-charcoal-700 hover:text-charcoal-900 hover:bg-canvas-200/40 rounded-md transition-colors whitespace-nowrap"
          >
            Leaderboard
          </a>
          <a
            href="/research/"
            className="px-3 py-1.5 text-sm font-medium text-charcoal-700 hover:text-charcoal-900 hover:bg-canvas-200/40 rounded-md transition-colors whitespace-nowrap"
          >
            Research
          </a>
        </nav>

        {/* Status Badge & CTA Button */}
        <div className="hidden lg:flex items-center gap-3">
          <div
            className="flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded border border-canvas-300 bg-canvas-100 text-charcoal-700 whitespace-nowrap"
            title={isConnected ? 'On-Device engine active on localhost (127.0.0.1:8000)' : 'Running locally in your browser'}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-teal-700 animate-pulse' : 'bg-teal-600'}`}></span>
            <span>{isConnected ? 'Local Engine' : 'On-Device'}</span>
          </div>

          {currentTab !== 'home' ? (
            <button
              onClick={() => handleNavClick('home')}
              className="px-3.5 py-1.5 bg-teal-800 hover:bg-teal-900 text-white rounded text-xs font-semibold shadow-subtle hover:shadow transition-all"
            >
              Try VaayuEdge
            </button>
          ) : (
            <button
              onClick={onExploreDemo}
              className="px-3.5 py-1.5 bg-charcoal-900 hover:bg-charcoal-800 text-white rounded text-xs font-semibold shadow-subtle hover:shadow transition-all"
            >
              Translator
            </button>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-2">
          {currentTab !== 'home' ? (
            <button
              onClick={() => handleNavClick('home')}
              className="px-2.5 py-1 bg-teal-800 text-white rounded text-xs font-semibold"
            >
              Try it
            </button>
          ) : (
            <button
              onClick={onExploreDemo}
              className="px-2.5 py-1 bg-charcoal-900 text-white rounded text-xs font-semibold"
            >
              Demo
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-charcoal-700 hover:text-charcoal-900 rounded-md hover:bg-canvas-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-700"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
        <div className="md:hidden border-b border-canvas-300 bg-canvas-50 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? 'bg-canvas-200 text-charcoal-900 font-semibold'
                    : 'text-charcoal-700 hover:bg-canvas-200/60'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <a
            href="/leaderboard/"
            className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-charcoal-700 hover:bg-canvas-200/60"
          >
            Leaderboard
          </a>
          <a
            href="/research/"
            className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-charcoal-700 hover:bg-canvas-200/60"
          >
            Research
          </a>
          <a
            href="/"
            className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-charcoal-700 hover:bg-canvas-200/60"
          >
            InferEdge AI Home
          </a>
          <div className="pt-3 border-t border-canvas-300 mt-2 flex items-center justify-between text-xs text-charcoal-600">
            <span>Processing mode:</span>
            <span className="font-mono text-teal-800">
              {isConnected ? 'Local Engine (127.0.0.1:8000)' : 'In-Browser (on-device)'}
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
