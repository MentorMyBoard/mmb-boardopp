import { useState, useEffect, useRef } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Upload, ImageIcon } from "lucide-react";
import { auth } from "../../utils/store";

const API_BASE = import.meta.env.VITE_API_URL || '';

interface Popup {
  id: string;
  title: string;
  image_url: string;
  orientation: string;
  image_width: number;
  image_height: number;
  button_text: string;
  button_url: string;
  position: string;
  is_active: number;
  created_at: string;
}

const POSITIONS = [
  { value: 'left-top',      label: 'Left — Top' },
  { value: 'left-bottom',   label: 'Left — Bottom' },
  { value: 'right-top',     label: 'Right — Top' },
  { value: 'right-bottom',  label: 'Right — Bottom' },
  { value: 'center-top',    label: 'Centre — Top' },
  { value: 'center-bottom', label: 'Centre — Bottom' },
];

const EMPTY = {
  title: '', image_url: '', orientation: 'landscape',
  image_width: 400, image_height: 280, button_text: '', button_url: '',
  position: 'right-bottom', is_active: 1,
};

function headers() {
  return { 'Content-Type': 'application/json', 'x-admin-token': auth.getToken() };
}

async function resizeAndEncode(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      const maxW = 900;
      let w = img.width, h = img.height;
      if (w > maxW) { h = Math.round(h * maxW / w); w = maxW; }
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(objectUrl);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error('Failed to load image')); };
    img.src = objectUrl;
  });
}

const FIELD: React.CSSProperties = {
  width: '100%', padding: '8px 12px', borderRadius: 8, fontSize: 13,
  background: '#1E1E22', border: '1px solid rgba(255,255,255,0.1)',
  color: '#F5F0E8', outline: 'none', boxSizing: 'border-box',
};

const LABEL: React.CSSProperties = {
  display: 'block', fontSize: 11, color: '#9B9BAB', fontWeight: 600,
  letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4,
};

export function AdminPopups() {
  const [popups, setPopups] = useState<Popup[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Popup | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [imagePreview, setImagePreview] = useState('');
  const [imageEncoding, setImageEncoding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API_BASE}/api/admin/popups`, { headers: headers() as HeadersInit });
      setPopups(await r.json());
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const reset = () => {
    setEditing(null);
    setForm({ ...EMPTY });
    setImagePreview('');
    setError('');
  };

  const openAdd = () => { reset(); setShowForm(true); };

  const openEdit = (p: Popup) => {
    setEditing(p);
    setForm({ title: p.title, image_url: p.image_url, orientation: p.orientation, image_width: p.image_width, image_height: p.image_height, button_text: p.button_text, button_url: p.button_url, position: p.position, is_active: p.is_active });
    setImagePreview(p.image_url);
    setError('');
    setShowForm(true);
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageEncoding(true);
    setError('');
    try {
      const encoded = await resizeAndEncode(file);
      setImagePreview(encoded);
      setForm((f) => ({ ...f, image_url: encoded }));
    } catch {
      setError('Could not load that image file. Please try another.');
    } finally {
      setImageEncoding(false);
    }
  };

  const save = async () => {
    if (!form.title.trim()) { setError('Please enter an Admin Label first.'); return; }
    if (!form.image_url) { setError('Please upload an image.'); return; }
    setError('');
    setSaving(true);
    try {
      const url = editing ? `${API_BASE}/api/admin/popups/${editing.id}` : `${API_BASE}/api/admin/popups`;
      const res = await fetch(url, { method: editing ? 'PUT' : 'POST', headers: headers() as HeadersInit, body: JSON.stringify(form) });
      if (!res.ok) throw new Error(await res.text());
      setShowForm(false);
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Save failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (p: Popup) => {
    await fetch(`${API_BASE}/api/admin/popups/${p.id}`, { method: 'PUT', headers: headers() as HeadersInit, body: JSON.stringify({ ...p, is_active: p.is_active ? 0 : 1 }) });
    await load();
  };

  const del = async (id: string) => {
    if (!confirm('Delete this popup?')) return;
    await fetch(`${API_BASE}/api/admin/popups/${id}`, { method: 'DELETE', headers: headers() as HeadersInit });
    await load();
  };

  const set = (k: keyof typeof EMPTY, v: string | number) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div style={{ maxWidth: 900 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ color: '#F5F0E8', fontSize: 22, fontWeight: 700, margin: 0 }}>Promotional Popups</h1>
          <p style={{ color: '#6A6A7A', fontSize: 13, marginTop: 4 }}>Manage floating promotional banners shown to website visitors.</p>
        </div>
        <button onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#F99F1B', color: '#0A0A0A', border: 'none', borderRadius: 8, padding: '9px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
          <Plus size={15} /> Add Popup
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div style={{ color: '#6A6A7A', fontSize: 14 }}>Loading…</div>
      ) : popups.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#6A6A7A', fontSize: 14 }}>No popups yet. Click "Add Popup" to create one.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {popups.map((p) => (
            <div key={p.id} style={{ background: '#141416', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 64, height: 44, borderRadius: 6, overflow: 'hidden', flexShrink: 0, background: '#1E1E22', border: '1px solid rgba(255,255,255,0.07)' }}>
                <img src={p.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#F5F0E8', fontSize: 14, fontWeight: 600 }}>{p.title}</span>
                  <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: p.is_active ? 'rgba(77,184,150,0.15)' : 'rgba(255,255,255,0.06)', color: p.is_active ? '#4DB896' : '#6A6A7A', fontWeight: 600 }}>
                    {p.is_active ? 'ACTIVE' : 'HIDDEN'}
                  </span>
                </div>
                <div style={{ color: '#6A6A7A', fontSize: 12, marginTop: 3 }}>
                  {POSITIONS.find((pos) => pos.value === p.position)?.label} &nbsp;·&nbsp; {p.image_width}×{p.image_height}px &nbsp;·&nbsp; {p.orientation}
                  {p.button_text && <> &nbsp;·&nbsp; Button: "{p.button_text}"</>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => toggleActive(p)} title={p.is_active ? 'Hide' : 'Show'} style={{ padding: '6px 8px', borderRadius: 7, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: p.is_active ? '#4DB896' : '#6A6A7A', cursor: 'pointer' }}>
                  {p.is_active ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button onClick={() => openEdit(p)} style={{ padding: '6px 8px', borderRadius: 7, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#9B9BAB', cursor: 'pointer' }}>
                  <Pencil size={14} />
                </button>
                <button onClick={() => del(p.id)} style={{ padding: '6px 8px', borderRadius: 7, background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.15)', color: '#FF6B6B', cursor: 'pointer' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#141416', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 28, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto' }}>
            {/* Modal header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ color: '#F5F0E8', fontSize: 18, fontWeight: 700, margin: 0 }}>{editing ? 'Edit Popup' : 'Add Popup'}</h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: '#6A6A7A', cursor: 'pointer', padding: 4 }}><X size={18} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Admin Label */}
              <div>
                <label style={LABEL}>Admin Label *</label>
                <input style={FIELD} value={form.title} onChange={(e) => { set('title', e.target.value); setError(''); }} placeholder="e.g. July Promo Banner" />
              </div>

              {/* Image upload */}
              <div>
                <label style={LABEL}>Popup Image *</label>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />

                {/* Upload area */}
                <div
                  onClick={() => fileRef.current?.click()}
                  style={{
                    border: '2px dashed rgba(249,159,27,0.35)', borderRadius: 10,
                    padding: imagePreview ? 0 : '28px 20px',
                    cursor: 'pointer', textAlign: 'center', overflow: 'hidden',
                    transition: 'border-color 0.15s',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(249,159,27,0.7)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(249,159,27,0.35)'; }}
                >
                  {imageEncoding ? (
                    <div style={{ padding: '28px 20px', color: '#9B9BAB', fontSize: 13 }}>Processing image…</div>
                  ) : imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Preview" style={{ width: '100%', maxHeight: 200, objectFit: 'cover', display: 'block' }} />
                      <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.65)', borderRadius: 6, padding: '4px 10px', fontSize: 11, color: '#F5F0E8' }}>
                        Click to change
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(249,159,27,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                        <ImageIcon size={18} color="#F99F1B" />
                      </div>
                      <div style={{ color: '#F5F0E8', fontSize: 13, fontWeight: 500 }}>Click to upload image</div>
                      <div style={{ color: '#6A6A7A', fontSize: 11, marginTop: 4 }}>JPG, PNG, WebP — auto-compressed for web</div>
                    </>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, padding: '7px 14px', color: '#C0C0C8', fontSize: 12, cursor: 'pointer' }}
                >
                  <Upload size={13} /> {imagePreview ? 'Replace Image' : 'Choose File'}
                </button>
              </div>

              {/* Orientation */}
              <div>
                <label style={LABEL}>Orientation</label>
                <select style={FIELD} value={form.orientation} onChange={(e) => set('orientation', e.target.value)}>
                  <option value="landscape">Landscape (wider than tall)</option>
                  <option value="portrait">Portrait (taller than wide)</option>
                </select>
              </div>

              {/* Size */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={LABEL}>Display Width (px)</label>
                  <input style={FIELD} type="number" min={100} max={800} value={form.image_width} onChange={(e) => set('image_width', Number(e.target.value))} />
                </div>
                <div>
                  <label style={LABEL}>Display Height (px)</label>
                  <input style={FIELD} type="number" min={100} max={800} value={form.image_height} onChange={(e) => set('image_height', Number(e.target.value))} />
                </div>
              </div>
              <div style={{ color: '#6A6A7A', fontSize: 11, marginTop: -8 }}>
                This controls the size of the popup on screen, not the original image dimensions.
              </div>

              {/* Position */}
              <div>
                <label style={LABEL}>Position on Screen</label>
                <select style={FIELD} value={form.position} onChange={(e) => set('position', e.target.value)}>
                  {POSITIONS.map((pos) => <option key={pos.value} value={pos.value}>{pos.label}</option>)}
                </select>
              </div>

              {/* Button */}
              <div>
                <label style={LABEL}>Button Text (optional)</label>
                <input style={FIELD} value={form.button_text} onChange={(e) => set('button_text', e.target.value)} placeholder="e.g. Register Now" />
              </div>
              <div>
                <label style={LABEL}>Button URL (optional)</label>
                <input style={FIELD} value={form.button_url} onChange={(e) => set('button_url', e.target.value)} placeholder="https://…" />
              </div>

              {/* Active toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input type="checkbox" id="popup-active" checked={form.is_active === 1} onChange={(e) => set('is_active', e.target.checked ? 1 : 0)} style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#F99F1B' }} />
                <label htmlFor="popup-active" style={{ color: '#C0C0C8', fontSize: 13, cursor: 'pointer' }}>Show this popup on the website</label>
              </div>

              {/* Error */}
              {error && (
                <div style={{ background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.25)', borderRadius: 8, padding: '10px 14px', color: '#FF6B6B', fontSize: 13 }}>
                  {error}
                </div>
              )}

              {/* Save */}
              <button
                onClick={save}
                disabled={saving || imageEncoding}
                style={{ marginTop: 4, background: '#F99F1B', color: '#0A0A0A', border: 'none', borderRadius: 9, padding: '12px 0', fontSize: 14, fontWeight: 700, cursor: saving || imageEncoding ? 'not-allowed' : 'pointer', opacity: saving || imageEncoding ? 0.7 : 1 }}
              >
                {saving ? 'Saving…' : imageEncoding ? 'Processing image…' : editing ? 'Save Changes' : 'Create Popup'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
