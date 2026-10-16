import { useState } from 'react';
import { config } from '../config';

const ITEMS = [
  ['forside', 'Forside'],
  ['praktisk', 'Praktisk Info'],
  ['billeder', 'Billeder'],
  ['oenskeseddel', 'Ønskeseddel'],
];

export default function Navbar({ page, navigate }) {
  const [open, setOpen] = useState(false);
  const go = (p) => { setOpen(false); navigate(p); };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <button id="nav-brand" onClick={() => go('forside')} className="font-serif italic text-2xl text-stone-900 hover:text-emerald-800 transition-colors">
          {config.monogram}
        </button>

        <ul className="hidden md:flex gap-8">
          {ITEMS.map(([key, label]) => (
            <li key={key}>
              <button
                id={`nav-${key}`}
                onClick={() => go(key)}
                className={`relative text-sm tracking-widest uppercase py-1 transition-colors ${
                  page === key ? 'text-stone-900' : 'text-stone-500 hover:text-stone-900'
                } after:absolute after:left-0 after:-bottom-0.5 after:h-px after:bg-emerald-700 after:transition-all after:duration-300 ${
                  page === key ? 'after:w-full' : 'after:w-0 hover:after:w-full'
                }`}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        <button id="nav-burger" className="md:hidden p-2 text-stone-700" onClick={() => setOpen(!open)} aria-label="Menu">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      {open && (
        <ul className="md:hidden animate-fadeIn bg-white/95 border-t border-stone-200 px-6 py-4 space-y-1">
          {ITEMS.map(([key, label]) => (
            <li key={key}>
              <button
                onClick={() => go(key)}
                className={`w-full text-left py-3 text-sm tracking-widest uppercase ${page === key ? 'text-emerald-800' : 'text-stone-600'}`}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
