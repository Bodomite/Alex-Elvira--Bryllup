import { useState } from 'react';
import { config } from '../config';

const Card = ({ children, className = '' }) => (
  <div className={`rounded-3xl p-8 md:p-10 border shadow-sm hover:shadow-xl transition-all duration-300 ${className}`}>{children}</div>
);

export const PageHeader = ({ title, children }) => (
  <div className="text-center mb-16">
    <h1 className="text-4xl md:text-6xl mb-5">{title}</h1>
    <div className="mx-auto w-16 h-px bg-emerald-700/50 mb-6" />
    <p className="text-stone-600 max-w-2xl mx-auto leading-relaxed">{children}</p>
  </div>
);

export default function Praktisk({ openDiet }) {
  const [showRsvp, setShowRsvp] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const { church, venue, rsvp, toastmaster } = config;

  return (
    <section className="pt-32 pb-24 px-6">
      <div className="max-w-5xl mx-auto animate-fadeIn">
        <PageHeader title="Praktisk Information">
          Her har vi samlet alle de praktiske detaljer, så I blot skal koncentrere jer om at nyde dagen sammen med os.
        </PageHeader>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-white/85 backdrop-blur border-stone-200">
            <div className="text-3xl mb-4">⛪</div>
            <h2 className="text-3xl mb-1">Vielse</h2>
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500 mb-5">Kl. 11:00 • {church.name}</p>
            <p className="text-stone-600 leading-relaxed mb-6">
              Vielsen finder sted i {church.name}. Traditionen tro skal gommens familie sidde i kirkens højre side, mens brudens familie skal sidde til venstre.
            </p>
            <a href={church.mapsUrl} target="_blank" rel="noreferrer" className="inline-flex px-5 py-2.5 rounded-full bg-stone-900 text-white text-sm hover:bg-emerald-900 transition">
              📍 Find Kirken Her
            </a>
          </Card>

          <Card className="bg-stone-900 text-white border-stone-800">
            <div className="text-3xl mb-4">🌲</div>
            <h2 className="text-3xl mb-1">Fest</h2>
            <p className="text-xs uppercase tracking-[0.2em] text-stone-400 mb-5">{venue.name}</p>
            <p className="text-stone-300 leading-relaxed mb-6">
              Efter vielsen fortsætter vi til {venue.name}, som ligger smukt midt i Tolne Skov. Her skal vi spise, skåle, danse og fejre kærligheden til langt ud på natten.
            </p>
            <a href={venue.mapsUrl} target="_blank" rel="noreferrer" className="inline-flex px-5 py-2.5 rounded-full bg-white text-stone-900 text-sm hover:bg-emerald-50 transition">
              📍 Find Skovpavillonen Her
            </a>
          </Card>

          <Card className="bg-white/85 backdrop-blur border-stone-200">
            <div className="text-3xl mb-4">💌</div>
            <h2 className="text-3xl mb-4">S.U.</h2>
            <p className="text-stone-600 leading-relaxed mb-6">
              Inviterede gæster bedes give besked om de kan komme senest d. <strong className="text-stone-900">{rsvp.deadline}</strong>.
            </p>
            {showRsvp ? (
              <a href={`mailto:${rsvp.email}?subject=${encodeURIComponent('Tilmelding til bryllup')}`} className="inline-block mb-6 font-serif text-xl text-emerald-800 hover:underline break-all animate-fadeIn">
                {rsvp.email}
              </a>
            ) : (
              <button id="show-rsvp" onClick={() => setShowRsvp(true)} className="mb-6 px-5 py-2.5 rounded-full border border-stone-300 text-sm hover:border-stone-900 transition">
                Vis email til tilmelding
              </button>
            )}
            <div className="pt-6 border-t border-stone-200">
              <p className="text-sm text-stone-500 mb-3">Har du allergier, eller er der noget, du ikke spiser? Indmeld kosthensyn direkte her:</p>
              <button onClick={openDiet} className="px-5 py-2.5 rounded-full bg-emerald-800 text-white text-sm hover:bg-emerald-900 transition">
                Meld allergier & kosthensyn
              </button>
            </div>
          </Card>

          <Card className="bg-white/85 backdrop-blur border-stone-200">
            <div className="text-3xl mb-4">🎤</div>
            <h2 className="text-3xl mb-4">Toastmaster</h2>
            <p className="text-stone-600 leading-relaxed mb-3">Vores toastmaster er <strong className="text-stone-900">{toastmaster.name}</strong>.</p>
            <p className="text-stone-600 leading-relaxed mb-6">
              Informationer omkring indslag (type, varighed og afsender) bedes sendes til hende pr. mail senest <strong className="text-stone-900">{toastmaster.deadline}</strong>.
            </p>
            {showToast ? (
              <a href={`mailto:${toastmaster.email}`} className="font-serif text-xl text-emerald-800 hover:underline break-all animate-fadeIn">
                {toastmaster.email}
              </a>
            ) : (
              <button id="show-toastmaster" onClick={() => setShowToast(true)} className="px-5 py-2.5 rounded-full border border-stone-300 text-sm hover:border-stone-900 transition">
                Vis email-adresse
              </button>
            )}
          </Card>

          <Card className="md:col-span-2 bg-gradient-to-br from-emerald-50/90 to-white/90 backdrop-blur border-emerald-100">
            <div className="text-3xl mb-4">🏕️</div>
            <h2 className="text-3xl mb-5">Overnatning</h2>
            <div className="grid md:grid-cols-2 gap-8 text-stone-600 leading-relaxed">
              <p>
                Der er ikke overnatning på selve {venue.name}. Til gengæld er det muligt at leje en hytte på den nærliggende{' '}
                <a href="https://www.tolnecamping.dk" target="_blank" rel="noreferrer" className="text-emerald-800 underline underline-offset-2">Tolne Camping</a>
                , som ligger få minutter fra festen.
              </p>
              <p>
                Man er også velkommen til selv at medbringe telt eller campingvogn og overnatte på {venue.name}s område.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-8">
              <div className="rounded-2xl bg-white/80 p-6 border border-stone-200">
                <h3 className="text-xl mb-2">🔌 Elbiler</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Der er ingen ladestandere ved {venue.name}, så sørg for at lade op inden I kører til festen.
                </p>
              </div>
              <div className="rounded-2xl bg-white/80 p-6 border border-stone-200">
                <h3 className="text-xl mb-2">⚡ Ladestationer tæt på</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Nærmeste ladestandere findes i Sindal (ca. 10 min. kørsel), bl.a. Clever ved Sindal Bibliotek og E.ON på Nørregade. Lynladere findes i Hjørring og Frederikshavn (ca. 20 min.). Tjek gerne{' '}
                  <a href="https://chargefinder.com/da" target="_blank" rel="noreferrer" className="text-emerald-800 underline underline-offset-2">ChargeFinder</a>{' '}
                  for aktuel status.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
