import { useState, useEffect } from "react";
import { community } from "../../utils/store";
import type { CommunityMember } from "../../utils/store";
import { Plus, Edit2, Trash2, Eye, EyeOff, X, Upload, Linkedin } from "lucide-react";

const INDUSTRIES = ["Financial Services", "Technology", "Healthcare", "Manufacturing", "Sustainability", "BFSI", "Education", "Infrastructure", "Other"];
const BADGE_OPTIONS = ["Independent Director", "ESG Specialist", "Board Advisor", "Committee Expert", "Industry Veteran", "Governance Professional", "Audit Expert", "Risk Specialist"];

function Modal({ title, data, onSave, onClose }: { title: string; data: Partial<CommunityMember>; onSave: (d: Partial<CommunityMember>) => void; onClose: () => void }) {
  const [form, setForm] = useState<Partial<CommunityMember>>({ name: '', photo: '', designation: '', industry: '', experience: '', expertise: [], badges: [], linkedin: '', order: 1, active: true, ...data });
  const upd = (k: string, v: string | number | boolean | string[]) => setForm((f) => ({ ...f, [k]: v }));

  const toggleArr = (key: 'expertise' | 'badges', val: string) => {
    const arr = (form[key] || []) as string[];
    upd(key, arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => upd('photo', ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={onClose}>
      <div style={{ background: '#1A1A1D', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 28, maxWidth: 580, width: '100%', maxHeight: '85vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ color: '#F5F0E8', fontSize: 16, fontWeight: 500 }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#5A5A6A', cursor: 'pointer' }}><X size={16} /></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Fld label="Name"><input value={form.name || ''} onChange={(e) => upd('name', e.target.value)} placeholder="Full name" style={inp} /></Fld>
            <Fld label="Designation"><input value={form.designation || ''} onChange={(e) => upd('designation', e.target.value)} placeholder="e.g. Independent Director" style={inp} /></Fld>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Fld label="Industry">
              <select value={form.industry || ''} onChange={(e) => upd('industry', e.target.value)} style={inp}>
                <option value="">Select</option>
                {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </Fld>
            <Fld label="Years of Experience"><input value={form.experience || ''} onChange={(e) => upd('experience', e.target.value)} placeholder="e.g. 25 years" style={inp} /></Fld>
          </div>
          <Fld label="LinkedIn Profile URL"><input value={form.linkedin || ''} onChange={(e) => upd('linkedin', e.target.value)} placeholder="https://linkedin.com/in/..." style={inp} /></Fld>
          <Fld label="Photo">
            <label style={{ display: 'flex', alignItems: 'center', gap: 12, border: '1px dashed rgba(255,255,255,0.15)', borderRadius: 10, padding: '12px', cursor: 'pointer' }}>
              {form.photo ? <img src={form.photo} alt="" style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover' }} /> : <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Upload size={18} color="#5A5A6A" /></div>}
              <span style={{ color: '#5A5A6A', fontSize: 12 }}>{form.photo ? 'Change photo' : 'Upload profile photo'}</span>
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            </label>
          </Fld>
          <Fld label="Areas of Expertise (comma separated)">
            <input value={(form.expertise || []).join(', ')} onChange={(e) => upd('expertise', e.target.value.split(',').map((v) => v.trim()).filter(Boolean))} placeholder="e.g. Risk Management, ESG, Audit" style={inp} />
          </Fld>
          <Fld label="Badges">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {BADGE_OPTIONS.map((b) => (
                <button key={b} onClick={() => toggleArr('badges', b)} style={{ fontSize: 11, padding: '5px 10px', borderRadius: 20, border: 'none', cursor: 'pointer', background: (form.badges || []).includes(b) ? 'rgba(249,159,27,0.2)' : 'rgba(255,255,255,0.06)', color: (form.badges || []).includes(b) ? '#F99F1B' : '#7A7A8A', outline: (form.badges || []).includes(b) ? '1px solid rgba(249,159,27,0.4)' : '1px solid rgba(255,255,255,0.08)' }}>
                  {b}
                </button>
              ))}
            </div>
          </Fld>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Fld label="Display Order"><input type="number" value={form.order || 1} onChange={(e) => upd('order', parseInt(e.target.value))} min={1} style={inp} /></Fld>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <input type="checkbox" checked={form.active ?? true} onChange={(e) => upd('active', e.target.checked)} style={{ accentColor: '#F99F1B' }} />
            <span style={{ color: '#C0C0C8', fontSize: 13 }}>Active</span>
          </label>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
          <button onClick={onClose} style={{ padding: '9px 16px', borderRadius: 9, background: 'rgba(255,255,255,0.06)', border: 'none', color: '#9B9BAB', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
          <button onClick={() => onSave(form as CommunityMember)} style={{ padding: '9px 18px', borderRadius: 9, background: '#F99F1B', border: 'none', color: '#0A0A0A', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Save</button>
        </div>
      </div>
    </div>
  );
}

export function AdminCommunity() {
  const [list, setList] = useState<CommunityMember[]>([]);
  const [modal, setModal] = useState<{ mode: 'add' | 'edit'; data: Partial<CommunityMember> } | null>(null);

  const load = () => setList(community.getAll().sort((a, b) => a.order - b.order));
  useEffect(load, []);

  const handleSave = (data: Partial<CommunityMember>) => {
    if (modal?.mode === 'edit' && data.id) {
      community.update(data.id, data);
    } else {
      community.add({ name: data.name || '', photo: data.photo || '', designation: data.designation || '', industry: data.industry || '', experience: data.experience || '', expertise: data.expertise || [], badges: data.badges || [], linkedin: data.linkedin || '', order: data.order || list.length + 1, active: data.active ?? true });
    }
    load(); setModal(null);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ color: '#F5F0E8', fontSize: 20, fontWeight: 500, marginBottom: 4 }}>Board Talent Community</h2>
          <p style={{ color: '#6A6A7A', fontSize: 13 }}>Manage profiles displayed in the community section.</p>
        </div>
        <button onClick={() => setModal({ mode: 'add', data: { order: list.length + 1, expertise: [], badges: [] } })} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F99F1B', border: 'none', color: '#0A0A0A', fontSize: 13, fontWeight: 600, padding: '9px 18px', borderRadius: 9, cursor: 'pointer' }}>
          <Plus size={14} /> Add Member
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((m) => (
          <div key={m.id} style={{ background: '#1A1A1D', border: `1px solid ${m.active ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)'}`, borderRadius: 12, padding: 16, opacity: m.active ? 1 : 0.5 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              {m.photo ? <img src={m.photo} alt={m.name} style={{ width: 48, height: 48, borderRadius: 10, objectFit: 'cover' }} /> : <div style={{ width: 48, height: 48, borderRadius: 10, background: 'rgba(249,159,27,0.1)', border: '1px solid rgba(249,159,27,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F99F1B', fontSize: 18, fontWeight: 700 }}>{m.name[0]}</div>}
              <div>
                <div style={{ color: '#E0E0E8', fontSize: 14, fontWeight: 500 }}>{m.name}</div>
                <div style={{ color: '#8A8A9A', fontSize: 11 }}>{m.designation}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#5A5A6A' }}>{m.industry} · {m.experience}</div>
              </div>
            </div>
            {m.badges.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
                {m.badges.map((b) => <span key={b} style={{ fontSize: 10, color: '#F99F1B', background: 'rgba(249,159,27,0.1)', border: '1px solid rgba(249,159,27,0.2)', padding: '2px 7px', borderRadius: 4 }}>{b}</span>)}
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#4A4A5A' }}>Order: {m.order}</span>
              <div style={{ display: 'flex', gap: 6 }}>
                {m.linkedin && <a href={m.linkedin} target="_blank" rel="noreferrer" title="LinkedIn" style={{ width: 28, height: 28, borderRadius: 7, background: 'rgba(136,144,255,0.1)', border: '1px solid rgba(136,144,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}><Linkedin size={12} color="#8890FF" /></a>}
                <IBtn icon={m.active ? Eye : EyeOff} color="#5FCF8A" title={m.active ? 'Deactivate' : 'Activate'} onClick={() => { community.update(m.id, { active: !m.active }); load(); }} />
                <IBtn icon={Edit2} color="#8890FF" title="Edit" onClick={() => setModal({ mode: 'edit', data: m })} />
                <IBtn icon={Trash2} color="#FF6B6B" title="Delete" onClick={() => { if (confirm('Remove this member?')) { community.remove(m.id); load(); } }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal && <Modal title={modal.mode === 'add' ? 'Add Community Member' : 'Edit Member'} data={modal.data} onSave={handleSave} onClose={() => setModal(null)} />}
    </div>
  );
}

function Fld({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 10, color: '#7A7A8A', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>{label}</label>{children}</div>;
}
const inp: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 9, padding: '10px 14px', color: '#F5F0E8', fontSize: 13, outline: 'none' };
function IBtn({ icon: Icon, color, title, onClick }: { icon: React.ElementType; color: string; title: string; onClick: () => void }) {
  return <button title={title} onClick={onClick} style={{ width: 28, height: 28, borderRadius: 7, background: `${color}15`, border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onMouseEnter={(e) => { e.currentTarget.style.background = `${color}30`; }} onMouseLeave={(e) => { e.currentTarget.style.background = `${color}15`; }}><Icon size={12} color={color} /></button>;
}
