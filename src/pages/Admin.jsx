import { useCallback, useEffect, useMemo, useState } from 'react';
import { config, API } from '../config';

export default function Admin() {
  const [token, setToken] = useState(() => sessionStorage.getItem('admin_token') || '');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [onlyNotes, setOnlyNotes] = useState(false);

  const api = useCallback(
    (body, tk = token) =>
      fetch(API.adminDiet, {
        method: body ? 'POST' : 'GET',
        headers: { Authorization: `Bearer ${tk}`, 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      }),
    [token],
  );

  const load = useCallback(async (tk = token) => {
    setLoading(true);
    try {
      const res = await api(null, tk);
      if (res.status === 401) { logout(); return false; }
      const d = await res.json();
      setRows(d.data || []);
      return true;
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, token]);

  useEffect(() => { if (token) load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const login = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoggingIn(true);
    try {
      const res = await api(null, password);
      if (res.status === 401) { setLoginError('Forkert adgangskode. Prøv igen.'); return; }
      const d = await res.json();
      sessionStorage.setItem('admin_token', password);
      setToken(password);
      setRows(d.data || []);
    } catch {
      setLoginError('Kunne ikke forbinde til serveren. Tjek din internetforbindelse.');
    } finally {
      setLoggingIn(false);
    }
  };

  function logout() {
    sessionStorage.removeItem('admin_token');
    setToken('');
    setRows([]);
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return rows.filter(
      (r) => (!q || r.navn.toLowerCase().includes(q) || r.hensyn.toLowerCase().includes(q)) && (!onlyNotes || r.note),
    );
  }, [rows, search, onlyNotes]);

  if (!token) {
    return (
      <section className="pt-32 pb-24 px-6">
        <form onSubmit={login} className="max-w-md mx-auto bg-white/90 backdrop-blur rounded-3xl p-10 border border-stone-200 shadow-xl animate-fadeIn">
          <span className="inline-block text-xs uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 mb-4">Bryllupsadministration</span>
          <h1 className="text-4xl italic mb-3">{config.coupleNames}</h1>
          <p className="text-stone-600 text-sm mb-8">Log ind for at se gæsternes kosthensyn og tilføje jeres egne noter.</p>
          <label htmlFor="admin-password" className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Adgangskode</label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Indtast adgangskode..."
            className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-300 mb-4"
          />
          {loginError && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2 mb-4">{loginError}</p>}
          <button id="admin-login" disabled={loggingIn} className="w-full py-3.5 rounded-full bg-emerald-800 text-white hover:bg-emerald-900 transition disabled:opacity-60">
            {loggingIn ? 'Logger ind...' : 'Log ind på portalen'}
          </button>
        </form>
      </section>
    );
  }

  return (
    <section className="pt-28 pb-24 px-4 md:px-6">
      <div className="max-w-6xl mx-auto animate-fadeIn">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="inline-block text-xs uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 mb-3">Administrationspanel</span>
            <h1 className="text-4xl">Kosthensyn & Allergier</h1>
            <p className="text-stone-600 text-sm mt-1">Overblik over indmeldelser fra {config.coupleNames}s bryllupsgæster.</p>
          </div>
          <div className="flex gap-2">
            <a href={`${API.exportDiet}?password=${encodeURIComponent(token)}`} className="px-5 py-2.5 rounded-full bg-emerald-600 text-white text-sm hover:bg-emerald-700 transition">
              Eksporter til Excel (CSV)
            </a>
            {rows.length > 0 && (
              <button
                onClick={async () => {
                  const c = prompt('Skriv "SLET ALT" for at tømme hele databasen permanent:');
                  if (c !== 'SLET ALT') return;
                  await api({ action: 'reset_all', confirm: 'SLET ALT' });
                  setRows([]);
                }}
                className="px-5 py-2.5 rounded-full bg-red-50 text-red-600 border border-red-200 text-sm hover:bg-red-100 transition"
              >
                Tøm database
              </button>
            )}
            <button onClick={logout} className="px-5 py-2.5 rounded-full border border-stone-300 text-sm hover:border-stone-900 transition">Log ud</button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <Stat label="Indmeldelser i alt" value={rows.length} />
          <Stat label="Med noter" value={rows.filter((r) => r.note).length} />
        </div>

        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Søg på gæstens navn eller kosthensyn..."
            className="flex-1 px-4 py-3 rounded-xl bg-white border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-300"
          />
          <button
            onClick={() => setOnlyNotes(!onlyNotes)}
            className={`px-4 py-3 rounded-xl text-sm border transition ${onlyNotes ? 'bg-amber-50 border-amber-500 text-amber-700' : 'bg-white border-stone-200'}`}
          >
            Kun med noter
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 overflow-x-auto shadow-sm">
          {loading ? (
            <p className="p-10 text-center text-stone-500">Henter kosthensyn fra databasen...</p>
          ) : filtered.length === 0 ? (
            <p className="p-10 text-center text-stone-500">Ingen indmeldelser matcher dine søgekriterier.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-stone-50 text-left text-xs uppercase tracking-wider text-stone-500">
                <tr>
                  <th className="p-4">Gæstens Navn</th>
                  <th className="p-4">Allergier & Kosthensyn</th>
                  <th className="p-4">Indmeldt Dato</th>
                  <th className="p-4 min-w-64">Note</th>
                  <th className="p-4">Handling</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <Row key={r.id} row={r} api={api} onDeleted={() => setRows((rs) => rs.filter((x) => x.id !== r.id))} onSaved={(note) => setRows((rs) => rs.map((x) => (x.id === r.id ? { ...x, note } : x)))} />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
}

const Stat = ({ label, value }) => (
  <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
    <p className="text-xs uppercase tracking-widest text-stone-500 mb-1">{label}</p>
    <p className="font-serif text-4xl">{value}</p>
  </div>
);

function Row({ row, api, onDeleted, onSaved }) {
  const [note, setNote] = useState(row.note || '');
  const [status, setStatus] = useState('');

  const save = async () => {
    if ((row.note || '') === note) return;
    setStatus('Gemmer...');
    await api({ action: 'update_note', id: row.id, note });
    onSaved(note || null);
    setStatus('Gemt! ✓');
    setTimeout(() => setStatus(''), 2000);
  };

  const del = async () => {
    if (!confirm(`Er du sikker på, at du vil slette registreringen for ${row.navn}?`)) return;
    await api({ action: 'delete_entry', id: row.id });
    onDeleted();
  };

  return (
    <tr className="border-t border-stone-100 align-top hover:bg-stone-50/60">
      <td className="p-4 font-medium">{row.navn}</td>
      <td className="p-4 text-stone-700 whitespace-pre-wrap">{row.hensyn}</td>
      <td className="p-4 text-stone-500 whitespace-nowrap">{row.formatted_date}</td>
      <td className="p-4">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onBlur={save}
          rows={2}
          placeholder="Tilføj en note til toastmasteren/køkkenet..."
          className="w-full px-3 py-2 rounded-lg bg-amber-50/50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-300 resize-y"
        />
        {status && <span className="text-xs text-emerald-600">{status}</span>}
      </td>
      <td className="p-4">
        <button onClick={del} className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100" title="Slet">🗑</button>
      </td>
    </tr>
  );
}
