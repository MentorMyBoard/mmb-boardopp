import { useState, useEffect } from "react";
import { fetchDirectorLeads, deleteDirectorLead, exportCsv } from "../../utils/store";
import type { DirectorLead } from "../../utils/store";
import { Search, Download, Trash2, Eye, X } from "lucide-react";

export function AdminDirectors() {
  const [list, setList] = useState<DirectorLead[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<DirectorLead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    fetchDirectorLeads()
      .then((data) => { setList(data); setError(''); })
      .catch(() => setError('Could not reach the server. Check that the backend is running.'))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const filtered = list.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.email.toLowerCase().includes(search.toLowerCase()) ||
    d.industry.toLowerCase().includes(search.toLowerCase()) ||
    d.location.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (confirm('Delete this director registration?')) {
      await deleteDirectorLead(id);
      load();
      if (selected?.id === id) setSelected(null);
    }
  };

  const handleExport = () => {
    exportCsv('director-leads.csv', list.map((d) => ({
      Name: d.name, Email: d.email, Phone: d.phone, Designation: d.designation,
      Industry: d.industry, Experience: d.experience, 'Board Experience': d.boardExperience,
      LinkedIn: d.linkedin, Expertise: d.expertise, 'Preferred Role': d.preferredRole,
      Location: d.location, 'Submitted At': new Date(d.submittedAt).toLocaleString('en-IN'),
    })));
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ color: '#F5F0E8', fontSize: 20, fontWeight: 500, marginBottom: 4 }}>Director Registrations</h2>
          <p style={{ color: '#6A6A7A', fontSize: 13 }}>{list.length} total submissions</p>
        </div>
        <button
          onClick={handleExport}
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(249,159,27,0.1)', border: '1px solid rgba(249,159,27,0.25)', color: '#F99F1B', fontSize: 13, fontWeight: 500, padding: '9px 16px', borderRadius: 9, cursor: 'pointer', transition: 'all 0.2s' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(249,159,27,0.2)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(249,159,27,0.1)'; }}
        >
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 20 }}>
        <Search size={14} color="#5A5A6A" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
        <input
          value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, industry or location..."
          style={{ width: '100%', background: '#1A1A1D', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '11px 16px 11px 36px', color: '#F5F0E8', fontSize: 13, outline: 'none' }}
        />
      </div>

      {error ? (
        <EmptyState message={error} />
      ) : loading ? (
        <EmptyState message="Loading…" />
      ) : filtered.length === 0 ? (
        <EmptyState message={search ? 'No results match your search.' : 'No director registrations yet.'} />
      ) : (
        <div style={{ background: '#1A1A1D', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['Name', 'Email', 'Designation', 'Industry', 'Experience', 'Location', 'Submitted', 'Actions'].map((h) => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#5A5A6A', fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((d, i) => (
                  <tr key={d.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', transition: 'background 0.15s' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    <td style={{ padding: '12px 16px', color: '#E0E0E8', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap' }}>{d.name}</td>
                    <td style={{ padding: '12px 16px', color: '#9B9BAB', fontSize: 12, whiteSpace: 'nowrap' }}>{d.email}</td>
                    <td style={{ padding: '12px 16px', color: '#9B9BAB', fontSize: 12, whiteSpace: 'nowrap' }}>{d.designation}</td>
                    <td style={{ padding: '12px 16px', color: '#9B9BAB', fontSize: 12, whiteSpace: 'nowrap' }}>{d.industry}</td>
                    <td style={{ padding: '12px 16px', color: '#9B9BAB', fontSize: 12, whiteSpace: 'nowrap' }}>{d.experience}</td>
                    <td style={{ padding: '12px 16px', color: '#9B9BAB', fontSize: 12, whiteSpace: 'nowrap' }}>{d.location}</td>
                    <td style={{ padding: '12px 16px', color: '#5A5A6A', fontSize: 11, fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>{new Date(d.submittedAt).toLocaleDateString('en-IN')}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <ActionBtn icon={Eye} color="#8890FF" title="View" onClick={() => setSelected(d)} />
                        <ActionBtn icon={Trash2} color="#FF6B6B" title="Delete" onClick={() => handleDelete(d.id)} />
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
                ['Email', selected.email], ['Phone', selected.phone], ['Designation', selected.designation],
                ['Industry', selected.industry], ['Experience', selected.experience], ['Board Experience', selected.boardExperience],
                ['Location', selected.location], ['Preferred Role', selected.preferredRole], ['LinkedIn', selected.linkedin],
                ['Expertise', selected.expertise], ['Resume', selected.resumeName || 'Not provided'],
                ['Submitted', new Date(selected.submittedAt).toLocaleString('en-IN')],
              ].map(([label, value]) => (
                <div key={label} style={{ gridColumn: label === 'Expertise' ? '1 / -1' : undefined }}>
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
