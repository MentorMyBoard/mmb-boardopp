import { useState, useEffect } from "react";
import { fetchCompanyLeads, deleteCompanyLead, exportCsv } from "../../utils/store";
import type { CompanyLead } from "../../utils/store";
import { Search, Download, Trash2, Eye, X } from "lucide-react";

export function AdminCompanies() {
  const [list, setList] = useState<CompanyLead[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<CompanyLead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    fetchCompanyLeads()
      .then((data) => { setList(data); setError(''); })
      .catch(() => setError('Could not reach the server. Check that the backend is running.'))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const filtered = list.filter((c) =>
    c.companyName.toLowerCase().includes(search.toLowerCase()) ||
    c.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.industry.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (confirm('Delete this company registration?')) {
      await deleteCompanyLead(id);
      load();
      if (selected?.id === id) setSelected(null);
    }
  };

  const handleExport = () => {
    exportCsv('company-leads.csv', list.map((c) => ({
      'Company Name': c.companyName, Industry: c.industry, 'Company Size': c.companySize,
      Website: c.website, 'Contact Person': c.contactPerson, Designation: c.designation,
      Email: c.email, Phone: c.phone,
      'Requirement Types': c.requirementTypes.join('; '), 'Additional Details': c.additionalDetails,
      'Submitted At': new Date(c.submittedAt).toLocaleString('en-IN'),
    })));
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ color: '#F5F0E8', fontSize: 20, fontWeight: 500, marginBottom: 4 }}>Company Registrations</h2>
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

      <div style={{ position: 'relative', marginBottom: 20 }}>
        <Search size={14} color="#5A5A6A" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
        <input
          value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by company name, contact, email or industry..."
          style={{ width: '100%', background: '#1A1A1D', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '11px 16px 11px 36px', color: '#F5F0E8', fontSize: 13, outline: 'none' }}
        />
      </div>

      {error || loading || filtered.length === 0 ? (
        <div style={{ background: '#1A1A1D', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '48px 24px', textAlign: 'center' }}>
          <p style={{ color: '#5A5A6A', fontSize: 14 }}>{error || (loading ? 'Loading…' : (search ? 'No results.' : 'No company registrations yet.'))}</p>
        </div>
      ) : (
        <div style={{ background: '#1A1A1D', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['Company', 'Industry', 'Size', 'Contact', 'Email', 'Requirements', 'Submitted', 'Actions'].map((h) => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#5A5A6A', fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => (
                  <tr key={c.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    <td style={{ padding: '12px 16px', color: '#E0E0E8', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap' }}>{c.companyName}</td>
                    <td style={{ padding: '12px 16px', color: '#9B9BAB', fontSize: 12, whiteSpace: 'nowrap' }}>{c.industry}</td>
                    <td style={{ padding: '12px 16px', color: '#9B9BAB', fontSize: 11, maxWidth: 120 }}><div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.companySize}</div></td>
                    <td style={{ padding: '12px 16px', color: '#9B9BAB', fontSize: 12, whiteSpace: 'nowrap' }}>{c.contactPerson}</td>
                    <td style={{ padding: '12px 16px', color: '#9B9BAB', fontSize: 12, whiteSpace: 'nowrap' }}>{c.email}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {c.requirementTypes.slice(0, 2).map((t) => (
                          <span key={t} style={{ fontSize: 10, color: '#F99F1B', background: 'rgba(249,159,27,0.1)', padding: '2px 6px', borderRadius: 4, whiteSpace: 'nowrap' }}>{t}</span>
                        ))}
                        {c.requirementTypes.length > 2 && <span style={{ fontSize: 10, color: '#5A5A6A' }}>+{c.requirementTypes.length - 2}</span>}
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#5A5A6A', fontSize: 11, fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>{new Date(c.submittedAt).toLocaleDateString('en-IN')}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <ABtn icon={Eye} color="#8890FF" title="View" onClick={() => setSelected(c)} />
                        <ABtn icon={Trash2} color="#FF6B6B" title="Delete" onClick={() => handleDelete(c.id)} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={() => setSelected(null)}>
          <div style={{ background: '#1A1A1D', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 32, maxWidth: 560, width: '100%', maxHeight: '80vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ color: '#F5F0E8', fontSize: 18, fontWeight: 500 }}>{selected.companyName}</h3>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#5A5A6A', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                ['Industry', selected.industry], ['Company Size', selected.companySize], ['Website', selected.website],
                ['Contact Person', selected.contactPerson], ['Designation', selected.designation],
                ['Email', selected.email], ['Phone', selected.phone],
              ].map(([label, value]) => (
                <div key={label}>
                  <div style={{ color: '#5A5A6A', fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
                  <div style={{ color: '#C0C0C8', fontSize: 13 }}>{value}</div>
                </div>
              ))}
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ color: '#5A5A6A', fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>Requirement Types</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {selected.requirementTypes.map((t) => <span key={t} style={{ fontSize: 12, color: '#F99F1B', background: 'rgba(249,159,27,0.1)', border: '1px solid rgba(249,159,27,0.2)', padding: '4px 10px', borderRadius: 6 }}>{t}</span>)}
                </div>
              </div>
              {selected.additionalDetails && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={{ color: '#5A5A6A', fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>Additional Details</div>
                  <div style={{ color: '#C0C0C8', fontSize: 13, lineHeight: 1.6 }}>{selected.additionalDetails}</div>
                </div>
              )}
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ color: '#5A5A6A', fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>Submitted</div>
                <div style={{ color: '#C0C0C8', fontSize: 13 }}>{new Date(selected.submittedAt).toLocaleString('en-IN')}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ABtn({ icon: Icon, color, title, onClick }: { icon: React.ElementType; color: string; title: string; onClick: () => void }) {
  return (
    <button title={title} onClick={onClick} style={{ width: 28, height: 28, borderRadius: 7, background: `${color}15`, border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s' }}
      onMouseEnter={(e) => { e.currentTarget.style.background = `${color}30`; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = `${color}15`; }}>
      <Icon size={12} color={color} />
    </button>
  );
}
