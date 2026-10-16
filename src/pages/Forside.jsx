import Hero from '../components/Hero';
import { config } from '../config';

export default function Forside({ navigate, openDiet }) {
  return (
    <>
      <Hero navigate={navigate} />

      <section id="program" className="py-24 px-6 scroll-mt-16">
        <div className="max-w-3xl mx-auto">
          <p className="text-center uppercase tracking-[0.3em] text-xs text-emerald-800 mb-3">{config.dateText}</p>
          <h2 className="text-center text-4xl md:text-5xl mb-4">Dagens Program</h2>
          <div className="mx-auto w-16 h-px bg-emerald-700/50 mb-16" />

          <ol className="relative border-l border-stone-300 ml-4 md:ml-24">
            {config.program.map((item, i) => (
              <li key={i} className="relative pl-8 md:pl-12 pb-14 last:pb-0 group">
                <span className="absolute -left-[7px] top-2 w-3.5 h-3.5 rounded-full bg-white border-2 border-emerald-700 group-hover:bg-emerald-700 transition" />
                <span className="md:absolute md:-left-28 md:top-1 md:w-20 md:text-right block font-serif italic text-2xl text-emerald-800 mb-1">
                  {item.time}
                </span>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-stone-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                  <h3 className="text-2xl mb-1">{item.title}</h3>
                  {item.location && <p className="text-xs uppercase tracking-[0.2em] text-stone-500 mb-4">{item.location}</p>}
                  <p className="text-stone-600 leading-relaxed">{item.description}</p>
                  {item.mapsKey && (
                    <a
                      href={config[item.mapsKey].mapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-full bg-stone-900 text-white text-sm hover:bg-emerald-900 transition"
                    >
                      📍 {item.mapsLabel}
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ol>

          {config.programPending && (
            <p className="mt-12 text-center text-stone-500 italic font-serif text-lg">
              Det fulde program for dagen følger – hold øje med siden.
            </p>
          )}

          <div className="mt-16 flex flex-col sm:flex-row gap-3 justify-center">
            <button id="program-praktisk" onClick={() => navigate('praktisk')} className="px-8 py-3.5 rounded-full border border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white transition">
              Praktisk info & rutevejledning
            </button>
            <button id="program-diet" onClick={openDiet} className="px-8 py-3.5 rounded-full bg-emerald-800 text-white hover:bg-emerald-900 transition">
              Indmeld allergier & kosthensyn
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
