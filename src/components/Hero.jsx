import { useEffect, useState } from 'react';
import { config, API } from '../config';

const FALLBACK = [
  'photo-1511285560929-80b456fea0bc',
  'photo-1519741497674-611481863552',
  'photo-1515934751635-c81c6bc9a2d8',
  'photo-1519225495810-751783d28bd3',
  'photo-1465495910483-34c1b27c2953',
  'photo-1532712938310-34cb3982ef74',
].map((id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&q=80&w=1920`);

function useCountdown(target) {
  const calc = () => {
    const q = Math.max(0, new Date(target).getTime() - Date.now());
    return {
      dage: Math.floor(q / 86400000),
      timer: Math.floor((q % 86400000) / 3600000),
      minutter: Math.floor((q % 3600000) / 60000),
      sekunder: Math.floor((q % 60000) / 1000),
    };
  };
  const [t, setT] = useState(calc);
  useEffect(() => {
    const i = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(i);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);
  return t;
}

export default function Hero({ navigate }) {
  const [images, setImages] = useState(FALLBACK);
  const [index, setIndex] = useState(0);
  const countdown = useCountdown(config.weddingDateISO);

  useEffect(() => {
    fetch(API.heroList)
      .then((r) => r.json())
      .then((list) => Array.isArray(list) && list.length > 0 && setImages(list))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const i = setInterval(() => setIndex((n) => (n + 1) % images.length), 8000);
    return () => clearInterval(i);
  }, [images.length]);

  return (
    <section className="relative h-screen min-h-[640px] w-full overflow-hidden flex items-center justify-center text-white">
      {images.map((src, i) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-[2500ms] ease-in-out ${i === index ? 'opacity-100' : 'opacity-0'}`}
        >
          <img
            src={src}
            alt=""
            className={`w-full h-full object-cover ${i === index ? 'ken-burns-active' : ''}`}
            loading={i === 0 ? 'eager' : 'lazy'}
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950/50 via-stone-950/30 to-stone-950/70" />

      <div className="relative z-10 text-center px-6 animate-fadeIn">
        <p className="uppercase tracking-[0.3em] font-light text-sm md:text-base mb-6">Vi skal giftes</p>
        <h1 className="font-serif italic text-5xl md:text-8xl mb-4 drop-shadow-lg">{config.coupleNames}</h1>
        <p className="font-serif text-lg md:text-2xl font-light mb-2 text-white/90">Snart Hr. og Fru {config.surname}</p>
        <p className="tracking-[0.2em] uppercase text-xs md:text-sm text-white/80 mb-10">
          {config.dateText} • {config.church.name}
        </p>

        <div className="flex justify-center gap-3 md:gap-6 mb-12">
          {Object.entries(countdown).map(([label, value]) => (
            <div key={label} className="w-20 md:w-28 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
              <div className="font-serif text-3xl md:text-5xl tabular-nums">{String(value).padStart(2, '0')}</div>
              <div className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/70 mt-1">{label}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            id="hero-program"
            href="#program"
            onClick={(e) => { e.preventDefault(); document.getElementById('program')?.scrollIntoView({ behavior: 'smooth' }); }}
            className="px-8 py-3.5 rounded-full bg-white text-stone-900 font-medium hover:bg-emerald-50 transition hover:-translate-y-0.5 shadow-lg"
          >
            Se programmet
          </a>
          <button id="hero-memories" onClick={() => navigate('billeder')} className="px-8 py-3.5 rounded-full border border-white/40 bg-white/10 backdrop-blur hover:bg-white/20 transition">
            Fælles Minder
          </button>
          <button id="hero-wishlist" onClick={() => navigate('oenskeseddel')} className="px-8 py-3.5 rounded-full border border-white/40 bg-white/10 backdrop-blur hover:bg-white/20 transition">
            Ønskeseddel
          </button>
        </div>
      </div>

      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Skift til billede ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-500 ${i === index ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'}`}
          />
        ))}
      </div>

      <button
        onClick={() => document.getElementById('program')?.scrollIntoView({ behavior: 'smooth' })}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 animate-bounce text-white/80"
        aria-label="Scroll ned"
      >
        <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 11l7 7 7-7" /></svg>
      </button>
    </section>
  );
}
