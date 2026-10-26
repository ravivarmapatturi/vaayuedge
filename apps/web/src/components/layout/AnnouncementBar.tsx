import { useState } from 'react';

interface AnnouncementBarProps {
  onExploreDemo?: () => void;
}

export default function AnnouncementBar({ onExploreDemo }: AnnouncementBarProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <aside aria-label="Announcement" className="bg-canvas-100 border-b border-canvas-300/80 px-4 py-2 text-xs text-charcoal-700 transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-teal-100 text-teal-800 border border-teal-200">
            Early Development
          </span>
          <span className="text-charcoal-800 font-medium">
            English → Telugu Speech Intelligence & Edge Validation · v0.1 Prototype
          </span>
        </div>
        <div className="flex items-center space-x-3">
          {onExploreDemo && (
            <button
              onClick={onExploreDemo}
              className="text-teal-700 hover:text-teal-900 font-semibold underline text-xs"
            >
              Test Demo →
            </button>
          )}
          <button
            onClick={() => setDismissed(true)}
            className="text-charcoal-400 hover:text-charcoal-700 p-0.5 rounded focus:outline-none"
            aria-label="Dismiss announcement"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
