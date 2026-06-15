import { useState, useEffect } from "react";
import { partners } from "../../utils/store";
import type { Partner } from "../../utils/store";
import { Plus, Edit2, Trash2, Eye, EyeOff, X, Upload } from "lucide-react";

function Modal({ title, data, onSave, onClose }: { title: string; data: Partial<Partner>; onSave: (d: Partial<Partner>) => void; onClose: () => void }) {
  const [form, setForm] = useState({ name: '', logo: '', website: '', order: 1, active: true, ...data });
  const upd = (k: string, v: string | number | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => upd('logo', ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={onClose}>
      <div style={{ background: '#1A1A1D', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 28, maxWidth: 480, width: '100%' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ color: '#F5F0E8', fontSize: 16, fontWeight: 500 }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#5A5A6A', cursor: 'pointer' }}><X size={16} /></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Fld label="Partner Name">
            <input value={form.name} onChange={(e) => upd('name', e.target.value)} placeholder="e.g. CII, SEBI, ICSI" style={inp} />
          </Fld>
          <Fld label="Logo (Upload Image)">
            <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, border: '1px dashed rgba(255,255,255,0.15)', borderRadius: 10, padding: '16px', cursor: 'pointer' }}>
              {form.logo ? (
                <img src={form.logo} alt="logo preview" style={{ height: 48, objectFit: 'contain' }} />
              ) : (
                <><Upload size={20} color="#5A5A6A" /><span style={{ color: '#5A5A6A', fontSize: 12 }}>Upload partner logo</span></>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
            </label>
            {form.logo && <button onClick={() => upd('logo', '')} style={{ color: '#FF6B6B', fontSize: 11, background: 'none', border: 'none', cursor: 'pointer', marginTop: 4 }}>Remove logo</button>}
          </Fld>
          <Fld label="Website URL">
            <input value={form.website} onChange={(e) => upd('website', e.target.value)} placeholder="https://partner.com" style={inp} />
          </Fld>
          <Fld label="Display Order">
            <input type="number" value={form.order} onChange={(e) => upd('order', parseInt(e.target.value))} min={1} style={inp} />
          </Fld>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <input type="checkbox" checked={form.active} onChange={(e) => upd('active', e.target.checked)} style={{ accentColor: '#F99F1B' }} />
            <span style={{ color: '#C0C0C8', fontSize: 13 }}>Active (visible on website)</span>
          </label>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
          <button onClick={onClose} style={{ padding: '9px 16px', borderRadius: 9, background: 'rgba(255,255,255,0.06)', border: 'none', color: '#9B9BAB', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
          <button onClick={() => onSave(form)} style={{ padding: '9px 18px', borderRadius: 9, background: 'linear-gradient(135deg,#F99F1B,#FFD36A)', border: 'none', color: '#0A0A0A', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Save</button>
        </div>
      </div>
    </div>
  );
}

export function AdminPartners() {
  const [list, setList] = useState<Partner[]>([]);
  const [modal, setModal] = useState<{ mode: 'add' | 'edit'; data: Partial<Partner> } | null>(null);

  const load = () => setList(partners.getAll().sort((a, b) => a.order - b.order));
  useEffect(load, []);

  const handleSave = (data: Partial<Partner>) => {
    if (modal?.mode === 'edit' && data.id) {
      partners.update(data.id, data);
    } else {
      partners.add({ name: data.name || '', logo: data.logo || '', website: data.website || '#', order: data.order || list.length + 1, active: data.active ?? true });
    }
    load(); setModal(null);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ color: '#F5F0E8', fontSize: 20, fontWeight: 500, marginBottom: 4 }}>Partners</h2>
          <p style={{ color: '#6A6A7A', fontSize: 13 }}>Manage partner logos displayed in the marquee section.</p>
        </div>
        <button onClick={() => setModal({ mode: 'add', data: { order: list.length + 1 } })} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,#F99F1B,#FFD36A)', border: 'none', color: '#0A0A0A', fontSize: 13, fontWeight: 600, padding: '9px 18px', borderRadius: 9, cursor: 'pointer' }}>
          <Plus size={14} /> Add Partner
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((p) => (
          <div key={p.id} style={{ background: '#1A1A1D', border: `1px solid ${p.active ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)'}`, borderRadius: 12, padding: 16, opacity: p.active ? 1 : 0.5 }}>
            <div style={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, background: 'rgba(255,255,255,0.04)', borderRadius: 8 }}>
              {p.logo ? (
                <img src={p.logo} alt={p.name} style={{ maxHeight: 44, maxWidth: '100%', objectFit: 'contain' }} />
              ) : (
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: '#F5F0E8' }}>{p.name}</span>
              )}
            </div>
            <div style={{ color: '#C0C0C8', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{p.name}</div>
            {p.website && p.website !== '#' && <a href={p.website} target="_blank" rel="noreferrer" style={{ color: '#8890FF', fontSize: 11, textDecoration: 'none', display: 'block', marginBottom: 12 }}>{p.website}</a>}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#4A4A5A' }}>Order: {p.order}</span>
              <div style={{ display: 'flex', gap: 6 }}>
                <IBtn icon={p.active ? Eye : EyeOff} color="#5FCF8A" title={p.active ? 'Deactivate' : 'Activate'} onClick={() => { partners.update(p.id, { active: !p.active }); load(); }} />
                <IBtn icon={Edit2} color="#8890FF" title="Edit" onClick={() => setModal({ mode: 'edit', data: p })} />
                <IBtn icon={Trash2} color="#FF6B6B" title="Delete" onClick={() => { if (confirm('Delete partner?')) { partners.remove(p.id); load(); } }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal && <Modal title={modal.mode === 'add' ? 'Add Partner' : 'Edit Partner'} data={modal.data} onSave={handleSave} onClose={() => setModal(null)} />}
    </div>
  );
}

function Fld({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 10, color: '#7A7A8A', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}
const inp: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 9, padding: '10px 14px', color: '#F5F0E8', fontSize: 13, outline: 'none' };

function IBtn({ icon: Icon, color, title, onClick }: { icon: React.ElementType; color: string; title: string; onClick: () => void }) {
  return <button title={title} onClick={onClick} style={{ width: 28, height: 28, borderRadius: 7, background: `${color}15`, border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onMouseEnter={(e) => { e.currentTarget.style.background = `${color}30`; }} onMouseLeave={(e) => { e.currentTarget.style.background = `${color}15`; }}><Icon size={12} color={color} /></button>;
}
