import { useEffect, useState } from 'react';
import { config, API } from '../config';
import { PageHeader } from './Praktisk';

const fmtPrice = (p, cur) =>
  !p ? 'Valgfrit beløb' : new Intl.NumberFormat('da-DK', { style: 'currency', currency: cur || 'DKK', maximumFractionDigits: p % 1 ? 2 : 0 }).format(p);

export default function Oenskeseddel() {
  const [state, setState] = useState({ loading: true, wishes: [], error: '' });

  useEffect(() => {
    if (!config.wishlistId) {
      setState({ loading: false, wishes: [], error: 'pending' });
      return;
    }
    fetch(`${API.wishlist}?id=${config.wishlistId}`)
      .then((r) => r.json())
      .then((d) => {
        if (!d.success) throw new Error(d.error);
        setState({ loading: false, wishes: d.wishes, error: '' });
      })
      .catch(() => setState({ loading: false, wishes: [], error: 'Ønskesedlen kunne ikke hentes lige nu. Prøv igen senere.' }));
  }, []);

  const listUrl = config.wishlistId ? `https://onskeskyen.dk/da/wishlists/${config.wishlistId}` : null;

  return (
    <section className="pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto animate-fadeIn">
        <PageHeader title="Vores Ønskeseddel">
          Herunder finder I vores ønsker.
          <br />
          Husk venligst at registrere jeres køb inde på Ønskeskyen ved at klikke på knappen under hvert ønske, så vi undgår dubletter.
        </PageHeader>

        {state.loading && <p className="text-center text-stone-500">Henter ønsker...</p>}

        {state.error === 'pending' && (
          <p className="text-center font-serif italic text-xl text-stone-500">Ønskesedlen kommer snart 🎁</p>
        )}
        {state.error && state.error !== 'pending' && (
          <p className="text-center text-stone-500">
            {state.error}{' '}
            {listUrl && <a href={listUrl} target="_blank" rel="noreferrer" className="text-emerald-800 underline">Se ønskesedlen på Ønskeskyen</a>}
          </p>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.wishes.map((w) => (
            <article key={w.id} className="group flex flex-col bg-white/85 backdrop-blur rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="aspect-[4/3] bg-stone-100 overflow-hidden">
                {w.image && (
                  <img src={w.image} alt={w.title} loading="lazy" className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-700" />
                )}
              </div>
              <div className="flex flex-col flex-1 p-6">
                <h2 className="text-xl mb-2">{w.title}</h2>
                {w.description && <p className="text-sm text-stone-600 leading-relaxed mb-4 line-clamp-3">{w.description}</p>}
                {w.quantity > 1 && <p className="text-xs text-stone-500 mb-2">Vi ønsker os {w.quantity} stk.</p>}
                <div className="mt-auto flex items-center justify-between gap-3 pt-4 border-t border-stone-100">
                  <span className="font-serif text-lg text-emerald-800">{fmtPrice(w.price, w.currency)}</span>
                  <a href={w.link} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-full bg-stone-900 text-white text-sm hover:bg-emerald-900 transition">
                    Se og reservér
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
