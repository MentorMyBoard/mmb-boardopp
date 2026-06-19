import { useState, useEffect } from "react";
import { testimonials } from "../../utils/store";
import type { Testimonial } from "../../utils/store";
import { Plus, Edit2, Trash2, Eye, EyeOff, X, Upload } from "lucide-react";

function Modal({ title, data, onSave, onClose }: { title: string; data: Partial<Testimonial>; onSave: (d: Partial<Testimonial>) => void; onClose: () => void }) {
  const [form, setForm] = useState({ name: '', designation: '', organization: '', photo: '', text: '', videoLink: '', order: 1, active: true, ...data });
  const upd = (k: string, v: string | number | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => upd('photo', ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={onClose}>
      <div style={{ background: '#1A1A1D', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 28, maxWidth: 540, width: '100%', maxHeight: '85vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ color: '#F5F0E8', fontSize: 16, fontWeight: 500 }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#5A5A6A', cursor: 'pointer' }}><X size={16} /></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Fld label="Name"><input value={form.name} onChange={(e) => upd('name', e.target.value)} placeholder="Full name" style={inp} /></Fld>
            <Fld label="Designation"><input value={form.designation} onChange={(e) => upd('designation', e.target.value)} placeholder="e.g. Independent Director" style={inp} /></Fld>
          </div>
          <Fld label="Organization"><input value={form.organization} onChange={(e) => upd('organization', e.target.value)} placeholder="Company / Board" style={inp} /></Fld>
          <Fld label="Testimonial *">
            <textarea value={form.text} onChange={(e) => upd('text', e.target.value)} rows={4} placeholder="Testimonial text..." style={{ ...inp, resize: 'vertical' }} />
          </Fld>
          <Fld label="Photo">
            <label style={{ display: 'flex', alignItems: 'center', gap: 12, border: '1px dashed rgba(255,255,255,0.15)', borderRadius: 10, padding: '12px', cursor: 'pointer' }}>
              {form.photo ? <img src={form.photo} alt="" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} /> : <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Upload size={18} color="#5A5A6A" /></div>}
              <span style={{ color: '#5A5A6A', fontSize: 12 }}>{form.photo ? 'Change photo' : 'Upload headshot'}</span>
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            </label>
          </Fld>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Fld label="Video Link (Optional)"><input value={form.videoLink || ''} onChange={(e) => upd('videoLink', e.target.value)} placeholder="https://..." style={inp} /></Fld>
            <Fld label="Display Order"><input type="number" value={form.order} onChange={(e) => upd('order', parseInt(e.target.value))} min={1} style={inp} /></Fld>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <input type="checkbox" checked={form.active} onChange={(e) => upd('active', e.target.checked)} style={{ accentColor: '#F99F1B' }} />
            <span style={{ color: '#C0C0C8', fontSize: 13 }}>Active</span>
          </label>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
          <button onClick={onClose} style={{ padding: '9px 16px', borderRadius: 9, background: 'rgba(255,255,255,0.06)', border: 'none', color: '#9B9BAB', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
          <button onClick={() => onSave(form)} style={{ padding: '9px 18px', borderRadius: 9, background: '#F99F1B', border: 'none', color: '#0A0A0A', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Save</button>
        </div>
      </div>
    </div>
  );
}

export function AdminTestimonials() {
  const [list, setList] = useState<Testimonial[]>([]);
  const [modal, setModal] = useState<{ mode: 'add' | 'edit'; data: Partial<Testimonial> } | null>(null);

  const load = () => setList(testimonials.getAll().sort((a, b) => a.order - b.order));
  useEffect(load, []);

  const handleSave = (data: Partial<Testimonial>) => {
    if (modal?.mode === 'edit' && data.id) {
      testimonials.update(data.id, data);
    } else {
      testimonials.add({ name: data.name || '', designation: data.designation || '', organization: data.organization || '', photo: data.photo || '', text: data.text || '', videoLink: data.videoLink, order: data.order || list.length + 1, active: data.active ?? true });
    }
    load(); setModal(null);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ color: '#F5F0E8', fontSize: 20, fontWeight: 500, marginBottom: 4 }}>Voices from the Boardroom</h2>
          <p style={{ color: '#6A6A7A', fontSize: 13 }}>Manage testimonials displayed on the website.</p>
        </div>
        <button onClick={() => setModal({ mode: 'add', data: { order: list.length + 1 } })} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F99F1B', border: 'none', color: '#0A0A0A', fontSize: 13, fontWeight: 600, padding: '9px 18px', borderRadius: 9, cursor: 'pointer' }}>
          <Plus size={14} /> Add Testimonial
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {list.map((t) => (
          <div key={t.id} style={{ background: '#1A1A1D', border: `1px solid ${t.active ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)'}`, borderRadius: 12, padding: '16px 20px', display: 'flex', gap: 16, opacity: t.active ? 1 : 0.5 }}>
            {t.photo ? <img src={t.photo} alt={t.name} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} /> : <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(249,159,27,0.1)', border: '1px solid rgba(249,159,27,0.2)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F99F1B', fontSize: 16, fontWeight: 700 }}>{t.name[0]}</div>}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: '#E0E0E8', fontSize: 14, fontWeight: 500 }}>{t.name}</div>
              <div style={{ color: '#F99F1B', fontSize: 12 }}>{t.designation} · {t.organization}</div>
              <div style={{ color: '#5A5A6A', fontSize: 12, marginTop: 6, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>"{t.text}"</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
              <IBtn icon={t.active ? Eye : EyeOff} color="#5FCF8A" title={t.active ? 'Deactivate' : 'Activate'} onClick={() => { testimonials.update(t.id, { active: !t.active }); load(); }} />
              <IBtn icon={Edit2} color="#8890FF" title="Edit" onClick={() => setModal({ mode: 'edit', data: t })} />
              <IBtn icon={Trash2} color="#FF6B6B" title="Delete" onClick={() => { if (confirm('Delete testimonial?')) { testimonials.remove(t.id); load(); } }} />
            </div>
          </div>
        ))}
      </div>
      {modal && <Modal title={modal.mode === 'add' ? 'Add Testimonial' : 'Edit Testimonial'} data={modal.data} onSave={handleSave} onClose={() => setModal(null)} />}
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
