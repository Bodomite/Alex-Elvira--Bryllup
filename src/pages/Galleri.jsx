import { useCallback, useEffect, useRef, useState } from 'react';
import ExifReader from 'exifreader';
import { API } from '../config';
import { PageHeader } from './Praktisk';

const MONTHS = ['Januar', 'Februar', 'Marts', 'April', 'Maj', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'December'];
const myUploads = () => JSON.parse(localStorage.getItem('wedding_my_uploads') || '[]');

export default function Galleri() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState(() => localStorage.getItem('wedding_guest_name') || '');
  const [human, setHuman] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState('');
  const [mine, setMine] = useState(myUploads);
  const [active, setActive] = useState(null);
  const fileRef = useRef(null);

  const load = useCallback(() => {
    fetch(API.photos)
      .then((r) => r.json())
      .then((d) => setItems(Array.isArray(d) ? d : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);
  useEffect(load, [load]);

  const ready = name.trim().length > 0 && human;

  const upload = async (files) => {
    if (!ready || honeypot) return;
    localStorage.setItem('wedding_guest_name', name.trim());
    setUploading(true);
    const ids = [...mine];
    let n = 0;
    for (const file of files) {
      n++;
      setProgress(`${n} / ${files.length}`);
      const fd = new FormData();
      fd.append('image', file);
      fd.append('author', name.trim());
      fd.append('type', file.type.startsWith('video/') ? 'video' : 'image');
      try {
        const res = await fetch(API.upload, { method: 'POST', body: fd });
        const d = await res.json();
        if (d.success && d.id) ids.push(d.id);
        else alert(`Kunne ikke uploade ${file.name}: ${d.error || 'ukendt fejl'}`);
      } catch {
        alert(`Kunne ikke uploade ${file.name}.`);
      }
    }
    localStorage.setItem('wedding_my_uploads', JSON.stringify(ids));
    setMine(ids);
    setUploading(false);
    setProgress('');
    if (fileRef.current) fileRef.current.value = '';
    load();
  };

  const remove = async (item) => {
    if (!confirm('Er du sikker på, at du vil slette dette minde permanent?')) return;
    try {
      const res = await fetch(API.deletePhoto, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, url: item.url, author: item.author }),
      });
      const d = await res.json();
      if (!d.success) throw new Error(d.error);
      const ids = mine.filter((i) => i !== item.id);
      localStorage.setItem('wedding_my_uploads', JSON.stringify(ids));
      setMine(ids);
      setActive(null);
      load();
    } catch (e) {
      alert(`Kunne ikke slette: ${e.message}`);
    }
  };

  return (
    <section className="pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto animate-fadeIn">
        <PageHeader title="Fælles Minder">
          Vi vil blive enormt glade, hvis I deler jeres bedste øjeblikke fra dagen med os.
          <br />
          Har I billeder af brudeparret fra alle årene før brylluppet, er I også velkomne til at dele disse i tiden op til brylluppet.
          <br />
          I kan slette de billeder og videoer, I selv har lagt op, fra den enhed de er lagt op fra.
        </PageHeader>

        <div className="max-w-xl mx-auto bg-white/85 backdrop-blur rounded-3xl p-8 border border-stone-200 shadow-sm mb-16">
          <input
            type="text"
            name="hp_website_verification"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            className="absolute -left-[9999px] opacity-0"
            aria-hidden="true"
          />
          <label htmlFor="guest-name" className="block text-xs uppercase tracking-widest text-stone-500 mb-2">
            Dit Navn <span className="text-red-500">*</span>
          </label>
          <input
            id="guest-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Skriv dit navn her..."
            className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-300"
          />
          <p className="text-xs text-stone-500 mt-2 mb-5">Navnet vises ved dine billeder i galleriet.</p>

          <label className="flex items-center gap-3 mb-6 cursor-pointer select-none">
            <input id="not-robot" type="checkbox" checked={human} onChange={(e) => setHuman(e.target.checked)} className="w-5 h-5 accent-emerald-700" />
            <span className="text-sm text-stone-700">Jeg er ikke en robot (påkrævet for upload) <span className="text-red-500">*</span></span>
          </label>

          <label
            className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl py-10 px-4 text-center transition ${
              ready && !uploading ? 'border-emerald-400 bg-emerald-50/50 cursor-pointer hover:bg-emerald-50' : 'border-stone-300 bg-stone-50 cursor-not-allowed opacity-70'
            }`}
          >
            <span className="text-4xl">{uploading ? '⏳' : '📸'}</span>
            <span className="text-sm text-stone-700">
              {uploading ? `Uploader medier... ${progress}` : ready ? 'Klik for at uploade fotos/video' : 'Udfyld navn og bekræftelse ovenfor for at uploade'}
            </span>
            <input
              id="upload-input"
              ref={fileRef}
              type="file"
              accept="image/*,video/*"
              multiple
              disabled={!ready || uploading}
              onChange={(e) => upload([...e.target.files])}
              className="hidden"
            />
          </label>
        </div>

        {loading ? (
          <p className="text-center text-stone-500">Henter minder...</p>
        ) : items.length === 0 ? (
          <p className="text-center font-serif italic text-xl text-stone-500">Ingen minder endnu. Bliv den første til at dele!</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {items.map((item, i) => (
              <div key={item.id} className="group relative aspect-square rounded-2xl overflow-hidden bg-stone-200 cursor-pointer shadow-sm hover:shadow-xl transition" onClick={() => setActive(i)}>
                {item.type === 'video' ? (
                  <video src={item.url} muted playsInline preload="metadata" className="w-full h-full object-cover" />
                ) : (
                  <img src={item.url} alt={`Minde delt af ${item.author}`} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                )}
                {item.type === 'video' && <span className="absolute top-3 left-3 text-white text-xl drop-shadow">▶</span>}
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 to-transparent text-white text-xs opacity-0 group-hover:opacity-100 transition">
                  Af: {item.author || 'Gæst'}
                </div>
                {mine.includes(item.id) && (
                  <button
                    title="Slet mit opslag"
                    onClick={(e) => { e.stopPropagation(); remove(item); }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-600 text-white text-sm opacity-80 hover:opacity-100 shadow"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {active !== null && items[active] && (
        <Lightbox
          item={items[active]}
          isMine={mine.includes(items[active].id)}
          onClose={() => setActive(null)}
          onPrev={() => setActive((a) => (a - 1 + items.length) % items.length)}
          onNext={() => setActive((a) => (a + 1) % items.length)}
          onDelete={() => remove(items[active])}
        />
      )}
    </section>
  );
}

function Lightbox({ item, isMine, onClose, onPrev, onNext, onDelete }) {
  const [taken, setTaken] = useState(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onPrev, onNext]);

  useEffect(() => {
    setTaken(null);
    if (item.type === 'video') return;
    let cancelled = false;
    setTaken('loading');
    fetch(item.url)
      .then((r) => r.arrayBuffer())
      .then((buf) => {
        const tags = ExifReader.load(buf);
        const raw = ['DateTimeOriginal', 'DateTimeDigitized', 'DateTime', 'CreateDate'].map((k) => tags[k]?.description).find(Boolean);
        const m = raw && raw.match(/^(\d{4}):(\d{2}):/);
        if (!cancelled) setTaken(m ? `${MONTHS[parseInt(m[2], 10) - 1]} ${m[1]}` : null);
      })
      .catch(() => !cancelled && setTaken(null));
    return () => { cancelled = true; };
  }, [item]);

  return (
    <div className="fixed inset-0 z-[70] bg-stone-950/95 flex flex-col animate-fadeIn" onClick={onClose}>
      <div className="flex items-center justify-between p-4 text-white" onClick={(e) => e.stopPropagation()}>
        <div>
          <p className="text-xs uppercase tracking-widest text-white/50">Delt af</p>
          <p className="font-serif text-xl">{item.author || 'Gæst'}</p>
          {taken === 'loading' && <p className="text-xs text-white/50 mt-1">Henter optagelsesdato...</p>}
          {taken && taken !== 'loading' && <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200">Taget i: {taken}</span>}
        </div>
        <div className="flex gap-2">
          {isMine && (
            <button onClick={onDelete} className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-500 text-sm">Slet dette billede permanent</button>
          )}
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20" aria-label="Luk">✕</button>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center relative px-4 pb-6" onClick={(e) => e.stopPropagation()}>
        <button onClick={onPrev} className="absolute left-2 md:left-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl" aria-label="Forrige">‹</button>
        {item.type === 'video' ? (
          <video key={item.url} src={item.url} controls autoPlay playsInline className="max-h-[80vh] max-w-full rounded-xl" />
        ) : (
          <img key={item.url} src={item.url} alt="" className="max-h-[80vh] max-w-full object-contain rounded-xl animate-fadeIn" />
        )}
        <button onClick={onNext} className="absolute right-2 md:right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl" aria-label="Næste">›</button>
      </div>
    </div>
  );
}
