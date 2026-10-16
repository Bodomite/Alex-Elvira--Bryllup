import { useEffect, useState } from 'react';
import { API } from '../config';

export default function DietModal({ open, onClose }) {
  const [name, setName] = useState('');
  const [details, setDetails] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) return setError('Venligst indtast dit fulde navn.');
    if (!details.trim()) return setError('Venligst skriv hvad du ikke kan tåle eller lide.');
    setSending(true);
    try {
      const res = await fetch(API.submitDiet, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), details: details.trim() }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      localStorage.setItem('wedding_diet_submitted', 'true');
      setDone(true);
    } catch {
      setError('Kunne ikke oprette forbindelse til serveren. Prøv venligst igen.');
    } finally {
      setSending(false);
    }
  };

  const dismiss = () => {
    localStorage.setItem('wedding_diet_dismissed', 'true');
    onClose();
  };

  const close = () => {
    onClose();
    if (done) { setDone(false); setName(''); setDetails(''); }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn" onClick={close}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="diet-title"
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 md:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={close} className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-900" aria-label="Luk">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 5l10 10M15 5L5 15" /></svg>
        </button>

        {done ? (
          <div className="text-center py-6">
            <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl">✓</div>
            <h2 id="diet-title" className="text-3xl mb-4">Tak for din indmelding!</h2>
            <p className="text-stone-600 mb-8 leading-relaxed">
              Vi har nu registreret dine oplysninger, og vi vil sørge for, at køkkenet tager højde for det på den store dag.
            </p>
            <button onClick={close} className="px-8 py-3 rounded-full bg-stone-900 text-white hover:bg-stone-800 transition">Luk vindue</button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className="text-3xl mb-3">🍽️</div>
            <h2 id="diet-title" className="text-3xl mb-3">Allergier & Kosthensyn</h2>
            <p className="text-stone-600 mb-6 leading-relaxed text-sm">
              Her kan du indmelde, hvis der er bestemte ting, du ikke kan tåle, er allergisk overfor, eller hvis du f.eks. ikke spiser rødt kød. Så sørger vi for at give køkkenet besked!
            </p>

            <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2" htmlFor="diet-name">Dit fulde navn</label>
            <input
              id="diet-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="F.eks. Elvira Karlsen"
              className="w-full mb-5 px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />

            <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2" htmlFor="diet-details">Hvad kan du ikke tåle eller lide?</label>
            <textarea
              id="diet-details"
              rows={4}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="F.eks. Tåler ikke gluten / Spiser ikke rødt kød / Meget allergisk overfor nødder."
              className="w-full mb-4 px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-300 resize-none"
            />

            {error && <p className="mb-4 text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">{error}</p>}

            <button id="diet-submit" type="submit" disabled={sending} className="w-full py-3.5 rounded-full bg-stone-900 text-white hover:bg-emerald-900 transition disabled:opacity-60">
              {sending ? 'Indsender...' : 'Indmeld kosthensyn'}
            </button>
            <button id="diet-dismiss" type="button" onClick={dismiss} className="w-full mt-3 py-2 text-sm text-stone-500 hover:text-stone-900 underline-offset-4 hover:underline">
              Jeg har ingen allergier eller særlige kosthensyn
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
