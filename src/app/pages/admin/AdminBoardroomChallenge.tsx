import { useState, useEffect } from "react";
import { boardroomChallenge, exportCsv } from "../../utils/store";
import type { ChallengeEntry } from "../../utils/store";
import { Search, Download, Trash2, Eye, X, ExternalLink } from "lucide-react";

const STYLE_NAMES = ['The Guardian', 'The Strategist', 'The Steward', 'The Interrogator', 'The Action Leader'];
const PICK_NAMES: Record<string, string> = { G: 'Guardian', S: 'Strategist', W: 'Steward', I: 'Interrogator', F: 'Action Leader' };

export function AdminBoardroomChallenge() {
  const [list, setList] = useState<ChallengeEntry[]>([]);
  const [search, setSearch] = useState('');
  const [styleFilter, setStyleFilter] = useState('');
  const [selected, setSelected] = useState<ChallengeEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    boardroomChallenge.getAll()
      .then((data) => { setList(data); setError(''); })
      .catch(() => setError('Could not reach the server. Check that the backend is running.'))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const completed = list.filter((e) => e.status === 'completed');
  const filtered = list.filter((e) => {
    const q = search.toLowerCase();
    const matches = e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q) || e.style.toLowerCase().includes(q);
    if (!matches) return false;
    if (styleFilter === 'registered') return e.status !== 'completed';
    return !styleFilter || e.style === styleFilter;
  });

  const handleDelete = async (id: string) => {
    if (confirm('Delete this challenge entry?')) {
      await boardroomChallenge.remove(id);
      load();
      if (selected?.id === id) setSelected(null);
    }
  };

  const handleExport = () => {
    exportCsv('boardroom-challenge-entries.csv', filtered.map((e) => ({
      Name: e.name, Email: e.email, Status: e.status === 'completed' ? 'Completed' : 'Registered only',
      Style: e.style, 'Runner-up': e.runnerUp, Seconds: e.seconds ?? '', 'Finished in time': e.status === 'completed' ? (e.overtime ? 'No (overtime)' : 'Yes') : '',
      'Casting vote used': e.castingVote ? 'Yes' : '', Answers: e.votes, Picks: e.picks,
      'Registered At': new Date(e.createdAt).toLocaleString('en-IN'),
      'Completed At': e.completedAt ? new Date(e.completedAt).toLocaleString('en-IN') : '',
    })));
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ color: '#F5F0E8', fontSize: 20, fontWeight: 500, marginBottom: 4 }}>60-Second Boardroom Challenge</h2>
          <p style={{ color: '#6A6A7A', fontSize: 13 }}>{list.length} entries · {completed.length} completed · {list.length - completed.length} registered but didn’t finish</p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={() => window.open('/boardroom-challenge', '_blank')}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#C0C0C8', fontSize: 13, fontWeight: 500, padding: '9px 16px', borderRadius: 9, cursor: 'pointer' }}
          >
            <ExternalLink size={14} /> Open challenge
          </button>
          <button
            onClick={handleExport}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(249,159,27,0.1)', border: '1px solid rgba(249,159,27,0.25)', color: '#F99F1B', fontSize: 13, fontWeight: 500, padding: '9px 16px', borderRadius: 9, cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(249,159,27,0.2)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(249,159,27,0.1)'; }}
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Style breakdown — click to filter */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 20 }}>
        {[...STYLE_NAMES, 'registered'].map((s) => {
          const count = s === 'registered' ? list.length - completed.length : completed.filter((e) => e.style === s).length;
          const active = styleFilter === s;
          return (
            <button
              key={s}
              onClick={() => setStyleFilter(active ? '' : s)}
              style={{ textAlign: 'left', background: active ? 'rgba(249,159,27,0.1)' : '#1A1A1D', border: `1px solid ${active ? 'rgba(249,159,27,0.35)' : 'rgba(255,255,255,0.06)'}`, borderRadius: 12, padding: '12px 14px', cursor: 'pointer', transition: 'all 0.15s' }}
            >
              <div style={{ color: active ? '#F99F1B' : '#5A5A6A', fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>
                {s === 'registered' ? 'Didn’t finish' : s.replace('The ', '')}
              </div>
              <div style={{ color: '#F5F0E8', fontSize: 22, fontWeight: 600 }}>{count}</div>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 20 }}>
        <Search size={14} color="#5A5A6A" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
        <input
          value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email or style..."
          style={{ width: '100%', background: '#1A1A1D', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '11px 16px 11px 36px', color: '#F5F0E8', fontSize: 13, outline: 'none' }}
        />
      </div>

      {error ? (
        <EmptyState message={error} />
      ) : loading ? (
        <EmptyState message="Loading…" />
      ) : filtered.length === 0 ? (
        <EmptyState message={search || styleFilter ? 'No entries match your filters.' : 'No one has taken the challenge yet.'} />
      ) : (
        <div style={{ background: '#1A1A1D', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['Name', 'Email', 'Style', 'Runner-up', 'Time', 'Date', 'Actions'].map((h) => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#5A5A6A', fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((e, i) => (
                  <tr key={e.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', transition: 'background 0.15s' }}
                    onMouseEnter={(ev) => { (ev.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; }}
                    onMouseLeave={(ev) => { (ev.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    <td style={{ padding: '12px 16px', color: '#E0E0E8', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap' }}>{e.name}</td>
                    <td style={{ padding: '12px 16px', color: '#9B9BAB', fontSize: 12, whiteSpace: 'nowrap' }}>{e.email}</td>
                    <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                      {e.status === 'completed'
                        ? <span style={{ color: '#F99F1B', fontSize: 12, fontWeight: 500 }}>{e.style}</span>
                        : <span style={{ color: '#5A5A6A', fontSize: 11, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Registered only</span>}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#9B9BAB', fontSize: 12, whiteSpace: 'nowrap' }}>{e.runnerUp || '—'}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap', color: e.overtime ? '#FF6B6B' : '#9B9BAB' }}>
                      {e.status === 'completed' ? `${e.seconds}s${e.overtime ? ' · overtime' : ''}` : '—'}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#5A5A6A', fontSize: 11, fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>{new Date(e.completedAt || e.createdAt).toLocaleDateString('en-IN')}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <ActionBtn icon={Eye} color="#8890FF" title="View" onClick={() => setSelected(e)} />
                        <ActionBtn icon={Trash2} color="#FF6B6B" title="Delete" onClick={() => handleDelete(e.id)} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          onClick={() => setSelected(null)}
        >
          <div
            style={{ background: '#1A1A1D', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 32, maxWidth: 560, width: '100%', maxHeight: '80vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ color: '#F5F0E8', fontSize: 18, fontWeight: 500 }}>{selected.name}</h3>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#5A5A6A', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                ['Email', selected.email],
                ['Status', selected.status === 'completed' ? 'Completed' : 'Registered, did not finish'],
                ['Thinking Style', selected.style || '—'],
                ['Runner-up', selected.runnerUp || '—'],
                ['Time taken', selected.status === 'completed' ? `${selected.seconds} seconds` : '—'],
                ['Finished in 60s', selected.status === 'completed' ? (selected.overtime ? 'No — overtime' : 'Yes') : '—'],
                ['Casting vote', selected.castingVote ? 'Yes — answers were tied' : 'No'],
                ['Answer tally', selected.votes || '—'],
                ['Answers in order', selected.picks ? selected.picks.split('').map((p, n) => `${n + 1}. ${PICK_NAMES[p] || p}`).join(' · ') : '—'],
                ['Registered', new Date(selected.createdAt).toLocaleString('en-IN')],
                ['Completed', selected.completedAt ? new Date(selected.completedAt).toLocaleString('en-IN') : '—'],
              ].map(([label, value]) => (
                <div key={label} style={{ gridColumn: label === 'Answers in order' ? '1 / -1' : undefined }}>
                  <div style={{ color: '#5A5A6A', fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
                  <div style={{ color: '#C0C0C8', fontSize: 13 }}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ActionBtn({ icon: Icon, color, title, onClick }: { icon: React.ElementType; color: string; title: string; onClick: () => void }) {
  return (
    <button
      title={title}
      onClick={onClick}
      style={{ width: 28, height: 28, borderRadius: 7, background: `${color}15`, border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s' }}
      onMouseEnter={(e) => { e.currentTarget.style.background = `${color}30`; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = `${color}15`; }}
    >
      <Icon size={12} color={color} />
    </button>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div style={{ background: '#1A1A1D', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '48px 24px', textAlign: 'center' }}>
      <p style={{ color: '#5A5A6A', fontSize: 14 }}>{message}</p>
    </div>
  );
}
