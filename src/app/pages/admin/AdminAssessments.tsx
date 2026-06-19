import { useState, useEffect } from "react";
import { assessments } from "../../utils/store";
import type { Assessment } from "../../utils/store";
import { Plus, Edit2, Trash2, Check, X, Eye, EyeOff, GripVertical } from "lucide-react";

const ICONS = ['🏛', '📊', '🌿', '⚖', '🔍', '📋', '🎯', '💼', '🔒', '🌐'];

function Modal({ title, data, onSave, onClose }: {
  title: string; data: Partial<Assessment>; onSave: (d: Partial<Assessment>) => void; onClose: () => void;
}) {
  const [form, setForm] = useState({ name: '', description: '', buttonText: 'Take Assessment', url: '', icon: '🏛', order: 1, active: true, ...data });
  const upd = (k: string, v: string | number | boolean) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={onClose}>
      <div style={{ background: '#1A1A1D', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 28, maxWidth: 500, width: '100%' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ color: '#F5F0E8', fontSize: 16, fontWeight: 500 }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#5A5A6A', cursor: 'pointer' }}><X size={16} /></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Fld label="Assessment Name">
            <input value={form.name} onChange={(e) => upd('name', e.target.value)} placeholder="e.g. Director Readiness Assessment" style={inp} />
          </Fld>
          <Fld label="Description">
            <textarea value={form.description} onChange={(e) => upd('description', e.target.value)} rows={3} placeholder="Brief description..." style={{ ...inp, resize: 'vertical' }} />
          </Fld>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Fld label="Button Text">
              <input value={form.buttonText} onChange={(e) => upd('buttonText', e.target.value)} style={inp} />
            </Fld>
            <Fld label="Display Order">
              <input type="number" value={form.order} onChange={(e) => upd('order', parseInt(e.target.value))} min={1} style={inp} />
            </Fld>
          </div>
          <Fld label="Assessment URL">
            <input value={form.url} onChange={(e) => upd('url', e.target.value)} placeholder="https://..." style={inp} />
          </Fld>
          <Fld label="Icon">
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {ICONS.map((ic) => (
                <button key={ic} onClick={() => upd('icon', ic)} style={{ width: 36, height: 36, borderRadius: 8, border: form.icon === ic ? '2px solid #F99F1B' : '1px solid rgba(255,255,255,0.1)', background: form.icon === ic ? 'rgba(249,159,27,0.1)' : 'rgba(255,255,255,0.05)', fontSize: 18, cursor: 'pointer' }}>
                  {ic}
                </button>
              ))}
            </div>
          </Fld>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <input type="checkbox" checked={form.active} onChange={(e) => upd('active', e.target.checked)} style={{ accentColor: '#F99F1B' }} />
            <span style={{ color: '#C0C0C8', fontSize: 13 }}>Active (visible on website)</span>
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

export function AdminAssessments() {
  const [list, setList] = useState<Assessment[]>([]);
  const [modal, setModal] = useState<{ mode: 'add' | 'edit'; data: Partial<Assessment> } | null>(null);

  const load = () => setList(assessments.getAll().sort((a, b) => a.order - b.order));
  useEffect(load, []);

  const handleSave = (data: Partial<Assessment>) => {
    if (modal?.mode === 'edit' && data.id) {
      assessments.update(data.id, data);
    } else {
      assessments.add({ name: data.name || '', description: data.description || '', buttonText: data.buttonText || '', url: data.url || '', icon: data.icon || '🏛', order: data.order || list.length + 1, active: data.active ?? true });
    }
    load();
    setModal(null);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ color: '#F5F0E8', fontSize: 20, fontWeight: 500, marginBottom: 4 }}>Assessments</h2>
          <p style={{ color: '#6A6A7A', fontSize: 13 }}>Manage assessment cards displayed on the website.</p>
        </div>
        <button onClick={() => setModal({ mode: 'add', data: { order: list.length + 1 } })} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F99F1B', border: 'none', color: '#0A0A0A', fontSize: 13, fontWeight: 600, padding: '9px 18px', borderRadius: 9, cursor: 'pointer' }}>
          <Plus size={14} /> Add Assessment
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {list.map((a) => (
          <div key={a.id} style={{ background: '#1A1A1D', border: `1px solid ${a.active ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)'}`, borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, opacity: a.active ? 1 : 0.5 }}>
            <GripVertical size={14} color="#3A3A4A" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: 24, flexShrink: 0 }}>{a.icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: '#E0E0E8', fontSize: 14, fontWeight: 500, marginBottom: 3 }}>{a.name}</div>
              <div style={{ color: '#5A5A6A', fontSize: 12, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.description}</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#F99F1B', background: 'rgba(249,159,27,0.1)', padding: '2px 6px', borderRadius: 4 }}>{a.buttonText}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#5A5A6A' }}>Order: {a.order}</span>
                {a.url && <a href={a.url} target="_blank" rel="noreferrer" style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#8890FF', textDecoration: 'none' }}>Visit URL ↗</a>}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <IconBtn icon={a.active ? Eye : EyeOff} color="#5FCF8A" title={a.active ? 'Deactivate' : 'Activate'} onClick={() => { assessments.update(a.id, { active: !a.active }); load(); }} />
              <IconBtn icon={Edit2} color="#8890FF" title="Edit" onClick={() => setModal({ mode: 'edit', data: a })} />
              <IconBtn icon={Trash2} color="#FF6B6B" title="Delete" onClick={() => { if (confirm('Delete this assessment?')) { assessments.remove(a.id); load(); } }} />
            </div>
          </div>
        ))}
      </div>

      {modal && <Modal title={modal.mode === 'add' ? 'Add Assessment' : 'Edit Assessment'} data={modal.data} onSave={handleSave} onClose={() => setModal(null)} />}
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

function IconBtn({ icon: Icon, color, title, onClick }: { icon: React.ElementType; color: string; title: string; onClick: () => void }) {
  return (
    <button title={title} onClick={onClick} style={{ width: 30, height: 30, borderRadius: 8, background: `${color}15`, border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s' }}
      onMouseEnter={(e) => { e.currentTarget.style.background = `${color}30`; }} onMouseLeave={(e) => { e.currentTarget.style.background = `${color}15`; }}>
      <Icon size={13} color={color} />
    </button>
  );
}
