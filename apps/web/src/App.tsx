import { useState, useEffect } from 'react';
import Navbar, { NavTab } from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import HowItWorksPage from './pages/HowItWorksPage';
import AboutPage from './pages/AboutPage';
import { fetchCapabilities, Capabilities } from './lib/api';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [capabilities, setCapabilities] = useState<Capabilities | null>(null);

  // Synchronize route with URL hash for reliable navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash === 'product' || hash === 'research') {
        setCurrentTab('home');
      } else if (hash === 'technology') {
        setCurrentTab('how-it-works');
      } else if (['home', 'how-it-works', 'about'].includes(hash)) {
        setCurrentTab(hash as NavTab);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    fetchCapabilities().then(setCapabilities);
  }, []);

  const handleSelectTab = (tab: NavTab) => {
    let targetTab = tab;
    if (tab === 'product' || tab === 'research') targetTab = 'home';
    if (tab === 'technology') targetTab = 'how-it-works';

    setCurrentTab(targetTab);
    window.location.hash = targetTab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreDemo = () => {
    if (currentTab !== 'home') {
      handleSelectTab('home');
      setTimeout(() => {
        const demoEl = document.getElementById('demo-workspace');
        if (demoEl) demoEl.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const demoEl = document.getElementById('demo-workspace');
      if (demoEl) demoEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-canvas-50 text-charcoal-900 flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onExploreDemo={handleExploreDemo}
        processingMode={capabilities?.processing_mode || 'local'}
        isConnected={capabilities?.isConnected ?? false}
      />

      {/* Main Content Router */}
      <main className="flex-1 w-full" id="main-content" tabIndex={-1}>
        {currentTab === 'home' && <HomePage onSelectTab={handleSelectTab} />}
        {currentTab === 'how-it-works' && <HowItWorksPage onSelectTab={handleSelectTab} />}
        {currentTab === 'about' && <AboutPage onSelectTab={handleSelectTab} />}
      </main>

      {/* Footer */}
      <Footer onSelectTab={handleSelectTab} />
    </div>
  );
}
