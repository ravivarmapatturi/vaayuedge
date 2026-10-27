import { useState, useEffect } from 'react';
import Navbar, { NavTab } from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import HowItWorksPage from './pages/HowItWorksPage';
import TechnologyPage from './pages/TechnologyPage';
import AboutPage from './pages/AboutPage';
import { fetchCapabilities, Capabilities } from './lib/api';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [capabilities, setCapabilities] = useState<Capabilities | null>(null);

  // Synchronize route with URL hash for 100% reliable GitHub Pages navigation on reload
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (['home', 'product', 'how-it-works', 'technology', 'about'].includes(hash)) {
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
    setCurrentTab(tab);
    window.location.hash = tab;
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
      {/* 1. Announcement Bar */}

      {/* 2. Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onExploreDemo={handleExploreDemo}
        processingMode={capabilities?.processing_mode || 'local'}
        isConnected={capabilities?.isConnected ?? false}
      />

      {/* 3. Main Content Router */}
      <main className="flex-1 w-full" id="main-content" tabIndex={-1}>
        {currentTab === 'home' && <HomePage onSelectTab={handleSelectTab} />}
        {currentTab === 'product' && <ProductPage />}
        {currentTab === 'how-it-works' && <HowItWorksPage />}
        {currentTab === 'technology' && <TechnologyPage />}
        {currentTab === 'about' && <AboutPage />}
      </main>

      {/* 4. Footer */}
      <Footer onSelectTab={handleSelectTab} />
    </div>
  );
}
