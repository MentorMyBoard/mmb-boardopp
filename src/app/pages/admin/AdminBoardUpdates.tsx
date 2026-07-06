import { useState, useEffect, useCallback } from "react";
import { RefreshCw, Plus, Check, EyeOff, Trash2, ExternalLink, AlertCircle, X, Edit2, BarChart2, Eye, FileText } from "lucide-react";
const API_BASE = import.meta.env.VITE_API_URL || '';
const ADMIN_TOKEN = 'boardopp-admin-2024-secure';
const ADMIN_HEADERS = { 'Content-Type': 'application/json', 'x-admin-token': ADMIN_TOKEN };

const CATEGORIES = ['Board Appointment', 'Board Change', 'Governance', 'ESG', 'Regulatory', 'Leadership', 'Board News'];
const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  pending:  { bg: 'rgba(249,159,27,0.12)',  color: '#F99F1B' },
  approved: { bg: 'rgba(77,184,150,0.12)',  color: '#4DB896' },
  hidden:   { bg: 'rgba(138,138,160,0.12)', color: '#8A8AA0' },
};

interface Article {
  id: string;
  headline: string;
  source_name: string;
  article_url: string;
  published_date: string;
  description: string;
  image_url: string;
  category: string;
  status: 'pending' | 'approved' | 'hidden';
  created_at: string;
}

interface Counts { pending?: number; approved?: number; hidden?: number; }

interface AddFormData {
  headline: string;
  source_name: string;
  article_url: string;
  published_date: string;
  description: string;
  image_url: string;
  category: string;
  status: string;
}

const EMPTY_FORM: AddFormData = {
  headline: '', source_name: '', article_url: '',
  published_date: new Date().toISOString().slice(0, 10),
  description: '', image_url: '', category: 'Board Appointment', status: 'approved',
};

function fmtDate(iso: string) {
  try { return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
  catch { return iso; }
}

export function AdminBoardUpdates() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [counts, setCounts] = useState<Counts>({});
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ newArticles: number; processedEmails: number; error?: string } | null>(null);
  const [lastSync, setLastSync] = useState<{ synced_at: string } | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editArticle, setEditArticle] = useState<Article | null>(null);
  const [form, setForm] = useState<AddFormData>(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchArticles = useCallback(async (statusFilter = filter) => {
    setLoading(true);
    try {
      const params = statusFilter !== 'all' ? `?status=${statusFilter}` : '';
      const r = await fetch(`${API_BASE}/api/admin/board-updates${params}`, { headers: ADMIN_HEADERS });
      const json = await r.json();
      setArticles(json.data || []);
      setCounts(json.counts || {});
    } finally {
      setLoading(false);
    }
  }, [filter]);

  const fetchSyncStatus = useCallback(async () => {
    try {
      const r = await fetch(`${API_BASE}/api/admin/board-updates/sync-status`, { headers: ADMIN_HEADERS });
      const json = await r.json();
      setLastSync(json.lastSync);
    } catch {}
  }, []);

  useEffect(() => {
    fetchArticles(filter);
    fetchSyncStatus();
  }, [filter, fetchArticles, fetchSyncStatus]);

  const handleSync = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const r = await fetch(`${API_BASE}/api/admin/board-updates/sync`, { method: 'POST', headers: ADMIN_HEADERS });
      const json = await r.json();
      if (json.success) {
        setSyncResult({ newArticles: json.newArticles, processedEmails: json.processedEmails });
        fetchArticles(filter);
        fetchSyncStatus();
      } else {
        setSyncResult({ newArticles: 0, processedEmails: 0, error: json.error });
      }
    } catch (err: unknown) {
      setSyncResult({ newArticles: 0, processedEmails: 0, error: err instanceof Error ? err.message : 'Sync failed' });
    } finally {
      setSyncing(false);
    }
  };

  const setStatus = async (id: string, status: string) => {
    await fetch(`${API_BASE}/api/admin/board-updates/${id}/status`, {
      method: 'PATCH', headers: ADMIN_HEADERS, body: JSON.stringify({ status }),
    });
    fetchArticles(filter);
  };

  const deleteArticle = async (id: string) => {
    if (!confirm('Delete this article?')) return;
    await fetch(`${API_BASE}/api/admin/board-updates/${id}`, { method: 'DELETE', headers: ADMIN_HEADERS });
    fetchArticles(filter);
  };

  const openAdd = () => { setForm(EMPTY_FORM); setEditArticle(null); setFormError(''); setShowAdd(true); };
  const openEdit = (a: Article) => {
    setForm({
      headline: a.headline, source_name: a.source_name, article_url: a.article_url,
      published_date: a.published_date?.slice(0, 10) || '',
      description: a.description || '', image_url: a.image_url || '',
      category: a.category, status: a.status,
    });
    setEditArticle(a);
    setFormError('');
    setShowAdd(true);
  };

  const handleSave = async () => {
    if (!form.headline.trim()) {
      setFormError('Headline is required.');
      return;
    }
    setSaving(true);
    setFormError('');
    try {
      const url = editArticle
        ? `${API_BASE}/api/admin/board-updates/${editArticle.id}`
        : `${API_BASE}/api/admin/board-updates`;
      const method = editArticle ? 'PUT' : 'POST';
      const r = await fetch(url, { method, headers: ADMIN_HEADERS, body: JSON.stringify(form) });
      const json = await r.json();
      if (!r.ok) { setFormError(json.error || 'Save failed'); return; }
      setShowAdd(false);
      fetchArticles(filter);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const totalAll = (counts.pending || 0) + (counts.approved || 0) + (counts.hidden || 0);
  const statusTabs = [
    { key: 'all', label: 'All', count: totalAll },
    { key: 'pending', label: 'Pending', count: counts.pending || 0 },
    { key: 'approved', label: 'Approved', count: counts.approved || 0 },
    { key: 'hidden', label: 'Hidden', count: counts.hidden || 0 },
  ];

  const [mainTab, setMainTab] = useState<'articles' | 'analytics'>('articles');

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ color: '#F5F0E8', fontSize: 22, fontWeight: 600, margin: 0 }}>BoardWatch</h1>
          <p style={{ color: '#6A6A7A', fontSize: 13, margin: '4px 0 0' }}>
            Curate governance news from Gmail alerts.
            {lastSync && <> Last synced: {fmtDate(lastSync.synced_at)}.</>}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            onClick={handleSync}
            disabled={syncing}
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 8, background: syncing ? 'rgba(25,25,112,0.3)' : 'rgba(25,25,112,0.5)', border: '1px solid rgba(25,25,112,0.7)', color: '#7B8CDE', fontSize: 13, fontWeight: 500, cursor: syncing ? 'wait' : 'pointer' }}
          >
            <RefreshCw size={13} style={{ animation: syncing ? 'spin 1s linear infinite' : 'none' }} />
            {syncing ? 'Syncing Gmail…' : 'Sync Gmail'}
          </button>
          <button
            onClick={openAdd}
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 8, background: '#F99F1B', border: 'none', color: '#0A0A0A', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
          >
            <Plus size={13} /> Add Manually
          </button>
        </div>
      </div>

      {/* Sync result banner */}
      {syncResult && (
        <div style={{
          marginBottom: 16, padding: '12px 16px', borderRadius: 8,
          background: syncResult.error ? 'rgba(255,107,107,0.08)' : 'rgba(77,184,150,0.08)',
          border: `1px solid ${syncResult.error ? 'rgba(255,107,107,0.25)' : 'rgba(77,184,150,0.25)'}`,
          color: syncResult.error ? '#FF6B6B' : '#4DB896', fontSize: 13,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          {syncResult.error
            ? <><AlertCircle size={14} /> {syncResult.error}</>
            : <><Check size={14} /> Sync complete — {syncResult.processedEmails} emails processed, {syncResult.newArticles} new articles added.</>
          }
          <button onClick={() => setSyncResult(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
            <X size={13} />
          </button>
        </div>
      )}

      {/* Main tab switcher */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        <button
          onClick={() => setMainTab('articles')}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer',
            background: mainTab === 'articles' ? 'rgba(249,159,27,0.1)' : 'transparent',
            border: mainTab === 'articles' ? '1px solid rgba(249,159,27,0.3)' : '1px solid rgba(255,255,255,0.07)',
            color: mainTab === 'articles' ? '#F99F1B' : '#6A6A7A',
          }}
        >
          <FileText size={13} /> Articles
        </button>
        <button
          onClick={() => setMainTab('analytics')}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer',
            background: mainTab === 'analytics' ? 'rgba(123,140,222,0.1)' : 'transparent',
            border: mainTab === 'analytics' ? '1px solid rgba(123,140,222,0.3)' : '1px solid rgba(255,255,255,0.07)',
            color: mainTab === 'analytics' ? '#7B8CDE' : '#6A6A7A',
          }}
        >
          <BarChart2 size={13} /> Analytics
        </button>
      </div>

      {mainTab === 'analytics' ? <AnalyticsTab /> : <>
      {/* Status tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {statusTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            style={{
              padding: '6px 14px', borderRadius: 7, fontSize: 12, fontWeight: 500, cursor: 'pointer',
              background: filter === tab.key ? 'rgba(249,159,27,0.1)' : 'transparent',
              border: filter === tab.key ? '1px solid rgba(249,159,27,0.3)' : '1px solid rgba(255,255,255,0.07)',
              color: filter === tab.key ? '#F99F1B' : '#6A6A7A',
            }}
          >
            {tab.label} <span style={{ marginLeft: 4, opacity: 0.7 }}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Articles list */}
      {loading ? (
        <div style={{ color: '#6A6A7A', fontSize: 14, padding: '40px 0', textAlign: 'center' }}>Loading…</div>
      ) : articles.length === 0 ? (
        <div style={{ color: '#6A6A7A', fontSize: 14, padding: '60px 0', textAlign: 'center' }}>
          No articles yet. Try syncing Gmail or adding one manually.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {articles.map((a) => (
            <div
              key={a.id}
              style={{
                background: '#141416', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10,
                padding: '14px 16px', display: 'flex', gap: 14, alignItems: 'flex-start',
              }}
            >
              {/* Status badge */}
              <div style={{ flexShrink: 0, marginTop: 2 }}>
                <span style={{
                  display: 'inline-block', padding: '2px 8px', borderRadius: 4, fontSize: 10,
                  fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em',
                  background: STATUS_COLORS[a.status]?.bg, color: STATUS_COLORS[a.status]?.color,
                }}>
                  {a.status}
                </span>
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: '#D8D4CC', fontSize: 14, fontWeight: 500, lineHeight: 1.45, marginBottom: 4 }}>
                  {a.headline}
                </div>
                <div style={{ display: 'flex', gap: 12, color: '#5A5A6A', fontSize: 11, flexWrap: 'wrap' }}>
                  <span>{a.source_name}</span>
                  <span>{fmtDate(a.published_date)}</span>
                  <span style={{
                    padding: '0 6px', borderRadius: 3,
                    background: 'rgba(123,140,222,0.1)', color: '#7B8CDE',
                  }}>{a.category}</span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                <a href={a.article_url} target="_blank" rel="noopener noreferrer"
                  style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#6A6A7A', textDecoration: 'none' }}
                  title="Open article">
                  <ExternalLink size={13} />
                </a>
                <button onClick={() => openEdit(a)}
                  style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#6A6A7A', cursor: 'pointer' }}
                  title="Edit">
                  <Edit2 size={13} />
                </button>
                {a.status !== 'approved' && (
                  <button onClick={() => setStatus(a.id, 'approved')}
                    style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, background: 'rgba(77,184,150,0.08)', border: '1px solid rgba(77,184,150,0.2)', color: '#4DB896', cursor: 'pointer' }}
                    title="Approve">
                    <Check size={13} />
                  </button>
                )}
                {a.status !== 'hidden' && (
                  <button onClick={() => setStatus(a.id, 'hidden')}
                    style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, background: 'rgba(138,138,160,0.08)', border: '1px solid rgba(138,138,160,0.2)', color: '#8A8AA0', cursor: 'pointer' }}
                    title="Hide">
                    <EyeOff size={13} />
                  </button>
                )}
                <button onClick={() => deleteArticle(a.id)}
                  style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, background: 'rgba(255,107,107,0.06)', border: '1px solid rgba(255,107,107,0.15)', color: '#FF6B6B', cursor: 'pointer' }}
                  title="Delete">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      </>}

      {/* Add / Edit modal */}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: '#141416', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, width: '100%', maxWidth: 560, padding: 28, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ color: '#F5F0E8', fontSize: 17, fontWeight: 600, margin: 0 }}>
                {editArticle ? 'Edit Article' : 'Add Article Manually'}
              </h2>
              <button onClick={() => setShowAdd(false)} style={{ background: 'none', border: 'none', color: '#6A6A7A', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            {formError && (
              <div style={{ marginBottom: 14, padding: '10px 14px', borderRadius: 7, background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.2)', color: '#FF6B6B', fontSize: 13 }}>
                {formError}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { key: 'headline', label: 'Headline *', placeholder: 'Article headline', multiline: true },
                { key: 'article_url', label: 'Article URL', placeholder: 'https://… (optional)' },
                { key: 'source_name', label: 'Source Name', placeholder: 'e.g. Economic Times' },
                { key: 'published_date', label: 'Published Date', type: 'date' },
                { key: 'description', label: 'Description', placeholder: 'Brief description…', multiline: true },
                { key: 'image_url', label: 'Thumbnail Image URL', placeholder: 'https://… (optional — auto-set when article is opened)' },
              ].map(({ key, label, placeholder, multiline, type }) => (
                <div key={key}>
                  <label style={{ display: 'block', color: '#8A8AA0', fontSize: 11, marginBottom: 5, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</label>
                  {multiline ? (
                    <textarea
                      value={(form as Record<string, string>)[key]}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                      placeholder={placeholder}
                      rows={key === 'headline' ? 2 : 3}
                      style={{ width: '100%', padding: '9px 12px', background: '#0F0F10', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 7, color: '#F5F0E8', fontSize: 13, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                    />
                  ) : (
                    <input
                      type={type || 'text'}
                      value={(form as Record<string, string>)[key]}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                      placeholder={placeholder}
                      style={{ width: '100%', padding: '9px 12px', background: '#0F0F10', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 7, color: '#F5F0E8', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                    />
                  )}
                </div>
              ))}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', color: '#8A8AA0', fontSize: 11, marginBottom: 5, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    style={{ width: '100%', padding: '9px 12px', background: '#0F0F10', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 7, color: '#F5F0E8', fontSize: 13, outline: 'none' }}
                  >
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', color: '#8A8AA0', fontSize: 11, marginBottom: 5, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                    style={{ width: '100%', padding: '9px 12px', background: '#0F0F10', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 7, color: '#F5F0E8', fontSize: 13, outline: 'none' }}
                  >
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="hidden">Hidden</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 }}>
              <button onClick={() => setShowAdd(false)}
                style={{ padding: '9px 18px', borderRadius: 7, background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#8A8AA0', fontSize: 13, cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                style={{ padding: '9px 20px', borderRadius: 7, background: saving ? '#ccc' : '#F99F1B', border: 'none', color: '#0A0A0A', fontSize: 13, fontWeight: 600, cursor: saving ? 'wait' : 'pointer' }}>
                {saving ? 'Saving…' : editArticle ? 'Save Changes' : 'Add Article'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── Analytics Tab ──────────────────────────────────────────────────────────

interface AnalyticsData {
  stats: { totalViews: number; totalOpens: number; todayViews: number; sessions7d: number; totalSessions: number };
  daily: { date: string; views: number; opens: number }[];
  topArticles: { article_id: string; article_headline: string; opens: number }[];
  recent: { event_type: string; article_headline: string | null; session_id: string; referrer: string; created_at: string }[];
}

function fmtTime(iso: string) {
  try { return new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }); }
  catch { return iso; }
}

function StatTile({ label, value, color, icon }: { label: string; value: number; color: string; icon: React.ReactNode }) {
  return (
    <div style={{ background: '#141416', border: `1px solid ${color}33`, borderRadius: 10, padding: '18px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ color: '#6A6A7A', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
        <span style={{ color, opacity: 0.7 }}>{icon}</span>
      </div>
      <div style={{ color: '#F5F0E8', fontSize: 28, fontWeight: 700 }}>{value.toLocaleString()}</div>
    </div>
  );
}

function DailyChart({ daily }: { daily: AnalyticsData['daily'] }) {
  if (!daily.length) return <div style={{ color: '#6A6A7A', fontSize: 13, padding: '20px 0' }}>No data yet.</div>;
  const maxV = Math.max(...daily.map((d) => d.views), 1);
  return (
    <div style={{ background: '#141416', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '20px 20px 16px', marginBottom: 20 }}>
      <div style={{ color: '#9A9AB0', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>Daily Views — Last 14 Days</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 100 }}>
        {daily.map((d) => (
          <div key={d.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
            <div style={{ width: '100%', background: 'rgba(25,25,112,0.5)', borderRadius: '4px 4px 0 0', height: `${Math.max((d.opens / maxV) * 100, 2)}%`, transition: 'height 0.4s' }} title={`${d.opens} opens`} />
            <div style={{ width: '100%', background: '#7B8CDE', borderRadius: '4px 4px 0 0', height: `${Math.max((d.views / maxV) * 100, 2)}%`, transition: 'height 0.4s', marginTop: 2 }} title={`${d.views} views`} />
            <span style={{ fontSize: 9, color: '#5A5A6A', textAlign: 'center', lineHeight: 1.2 }}>{d.date.slice(5)}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#6A6A7A' }}><span style={{ width: 10, height: 10, background: '#7B8CDE', borderRadius: 2 }} />Page Views</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#6A6A7A' }}><span style={{ width: 10, height: 10, background: 'rgba(25,25,112,0.5)', borderRadius: 2 }} />Article Opens</span>
      </div>
    </div>
  );
}

function AnalyticsTab() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    fetch(`${API_BASE}/api/admin/board-updates/analytics`, { headers: ADMIN_HEADERS })
      .then(async (r) => {
        const json = await r.json().catch(() => null);
        if (!r.ok) {
          throw new Error(`HTTP ${r.status}: ${json?.detail || json?.error || r.statusText}`);
        }
        return json;
      })
      .then(setData)
      .catch((e) => setFetchError(e.message || 'Unknown error'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ color: '#6A6A7A', fontSize: 14, padding: '48px 0', textAlign: 'center' }}><RefreshCw size={18} style={{ animation: 'spin 1s linear infinite', marginBottom: 8 }} /><br />Loading analytics…</div>;
  if (fetchError || !data) return (
    <div style={{ color: '#FF6B6B', fontSize: 13, padding: '32px 0' }}>
      Failed to load analytics.{fetchError && <><br /><span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, opacity: 0.7 }}>{fetchError}</span></>}
    </div>
  );

  return (
    <div>
      {/* Stat tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginBottom: 20 }}>
        <StatTile label="Total Page Views"   value={data.stats.totalViews}    color="#7B8CDE" icon={<Eye size={14} />} />
        <StatTile label="Article Opens"      value={data.stats.totalOpens}    color="#4DB896" icon={<FileText size={14} />} />
        <StatTile label="Today's Views"      value={data.stats.todayViews}    color="#F99F1B" icon={<BarChart2 size={14} />} />
        <StatTile label="Sessions (7 days)"  value={data.stats.sessions7d}    color="#C77DFF" icon={<Eye size={14} />} />
        <StatTile label="Total Sessions"     value={data.stats.totalSessions} color="#4DB896" icon={<Eye size={14} />} />
      </div>

      {/* Daily chart */}
      <DailyChart daily={data.daily} />

      {/* Top articles + Recent side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="analytics-grid">
        {/* Top articles */}
        <div style={{ background: '#141416', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: 20 }}>
          <div style={{ color: '#9A9AB0', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>Most Opened Articles</div>
          {data.topArticles.length === 0 ? (
            <div style={{ color: '#5A5A6A', fontSize: 13 }}>No article opens yet.</div>
          ) : data.topArticles.map((a, i) => (
            <div key={a.article_id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', paddingBottom: 10, marginBottom: 10, borderBottom: i < data.topArticles.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4A4A6A', minWidth: 18, paddingTop: 1 }}>#{i + 1}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: '#C8C4BC', fontSize: 12, lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{a.article_headline}</div>
              </div>
              <span style={{ background: 'rgba(77,184,150,0.12)', color: '#4DB896', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4, flexShrink: 0 }}>{a.opens}</span>
            </div>
          ))}
        </div>

        {/* Recent activity */}
        <div style={{ background: '#141416', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: 20, maxHeight: 440, overflowY: 'auto' }}>
          <div style={{ color: '#9A9AB0', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>Recent Activity</div>
          {data.recent.length === 0 ? (
            <div style={{ color: '#5A5A6A', fontSize: 13 }}>No activity yet.</div>
          ) : data.recent.map((ev, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', paddingBottom: 8, marginBottom: 8, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{
                flexShrink: 0, marginTop: 1, padding: '2px 7px', borderRadius: 4, fontSize: 9,
                fontFamily: 'var(--font-mono)', textTransform: 'uppercase',
                background: ev.event_type === 'page_view' ? 'rgba(123,140,222,0.15)' : 'rgba(77,184,150,0.12)',
                color: ev.event_type === 'page_view' ? '#7B8CDE' : '#4DB896',
              }}>{ev.event_type === 'page_view' ? 'visit' : 'read'}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                {ev.article_headline && <div style={{ color: '#C8C4BC', fontSize: 11, lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{ev.article_headline}</div>}
                {ev.referrer && <div style={{ color: '#4A4A6A', fontSize: 10, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>from: {ev.referrer}</div>}
              </div>
              <span style={{ color: '#4A4A6A', fontSize: 10, flexShrink: 0, paddingTop: 1 }}>{fmtTime(ev.created_at)}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 700px) { .analytics-grid { grid-template-columns: 1fr !important; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

// ── Re-export main component with tab switcher ─────────────────────────────

export { AnalyticsTab };
