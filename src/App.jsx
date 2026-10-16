import { useEffect, useState } from 'react';
import { config } from './config';
import LeafCanvas from './components/LeafCanvas';
import Navbar from './components/Navbar';
import Forside from './pages/Forside';
import Praktisk from './pages/Praktisk';
import Oenskeseddel from './pages/Oenskeseddel';
import Galleri from './pages/Galleri';
import Admin from './pages/Admin';
import DietModal from './components/DietModal';

const ROUTES = ['forside', 'praktisk', 'billeder', 'oenskeseddel', 'admin'];

function routeFromHash() {
  const h = window.location.hash.replace(/^#\/?/, '').replace(/\/$/, '');
  return ROUTES.includes(h) ? h : 'forside';
}

export default function App() {
  const [page, setPage] = useState(routeFromHash);
  const [dietOpen, setDietOpen] = useState(false);

  useEffect(() => {
    const onHash = () => setPage(routeFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const navigate = (p) => {
    window.location.hash = p === 'forside' ? '' : `${p}/`;
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Åbn kosthensyn automatisk på forsiden, hvis gæsten ikke allerede har svaret
  useEffect(() => {
    if (page !== 'forside') return;
    if (localStorage.getItem('wedding_diet_submitted') || localStorage.getItem('wedding_diet_dismissed')) return;
    const t = setTimeout(() => setDietOpen(true), 1500);
    return () => clearTimeout(t);
  }, [page]);

  const openDiet = () => setDietOpen(true);

  return (
    <div className="min-h-screen flex flex-col relative">
      <LeafCanvas />
      <Navbar page={page} navigate={navigate} />

      <main className="flex-1 relative z-10">
        {page === 'forside' && <Forside navigate={navigate} openDiet={openDiet} />}
        {page === 'praktisk' && <Praktisk openDiet={openDiet} />}
        {page === 'oenskeseddel' && <Oenskeseddel />}
        {page === 'billeder' && <Galleri />}
        {page === 'admin' && <Admin />}
      </main>

      {page !== 'admin' && (
        <button
          id="floating-diet-button"
          onClick={openDiet}
          className="group fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-stone-900 text-white shadow-xl shadow-stone-900/20 px-4 py-3 hover:bg-emerald-900 transition-all duration-300 hover:-translate-y-0.5"
          aria-label="Indmeld kosthensyn"
        >
          <span className="text-lg">🍽️</span>
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs md:max-w-xs transition-all duration-500 text-sm tracking-wide">
            Kosthensyn
          </span>
        </button>
      )}

      <footer className="relative z-10 py-12 text-center border-t border-stone-200 bg-white/60 backdrop-blur-sm">
        <p className="font-serif italic text-2xl text-stone-800 mb-2">{config.dateText}</p>
        <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
          © {config.year} {config.groom} & {config.bride}
        </p>
      </footer>

      <DietModal open={dietOpen} onClose={() => setDietOpen(false)} />
    </div>
  );
}
