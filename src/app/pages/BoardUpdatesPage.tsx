import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, RefreshCw, Newspaper, Calendar, Globe, X, AlertCircle } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { MmbEcosystem } from "../components/MmbEcosystem";
import { CustomCursor } from "../components/CustomCursor";

const API_BASE = import.meta.env.VITE_API_URL || '';

const CATEGORIES = ['All', 'Board Appointment', 'Board Change', 'Governance', 'ESG', 'Board News'];

interface Article {
  id: string;
  headline: string;
  source_name: string;
  article_url: string;
  published_date: string;
  description: string;
  image_url: string;
  category: string;
}

interface ArticleContent {
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  content: string;
}

function formatDate(iso: string) {
  try { return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
  catch { return iso; }
}

const CAT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Board Appointment': { bg: 'rgba(77,184,150,0.1)',  text: '#1A7A5E', border: 'rgba(77,184,150,0.3)' },
  'Board Change':      { bg: 'rgba(249,159,27,0.1)',  text: '#B87010', border: 'rgba(249,159,27,0.3)' },
  'Governance':        { bg: 'rgba(25,25,112,0.08)',  text: '#191970', border: 'rgba(25,25,112,0.25)' },
  'ESG':               { bg: 'rgba(199,125,255,0.1)', text: '#7B3FA8', border: 'rgba(199,125,255,0.3)' },
  'Board News':        { bg: 'rgba(100,100,120,0.08)', text: '#5A5A78', border: 'rgba(100,100,120,0.2)' },
};

function CategoryBadge({ category }: { category: string }) {
  const c = CAT_COLORS[category] || CAT_COLORS['Board News'];
  return (
    <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 5, background: c.bg, color: c.text, border: `1px solid ${c.border}`, fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
      {category}
    </span>
  );
}

// ── Article Modal ──────────────────────────────────────────────────────────

function ArticleModal({ article, onClose }: { article: Article; onClose: () => void }) {
  const [content, setContent] = useState<ArticleContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    setLoading(true); setError(''); setContent(null);
    fetch(`${API_BASE}/api/board-updates/content?url=${encodeURIComponent(article.article_url)}`)
      .then((r) => r.json())
      .then((data) => { if (data.error) setError('Content could not be loaded.'); else setContent(data); })
      .catch(() => setError('Failed to load. Please try again.'))
      .finally(() => setLoading(false));
  }, [article.article_url]);

  const heroImage = content?.ogImage || article.image_url || '';
  const bodyText = content?.content || content?.ogDescription || article.description || '';
  const cat = CAT_COLORS[article.category] || CAT_COLORS['Board News'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(8,8,28,0.88)', zIndex: 2000, overflowY: 'auto', backdropFilter: 'blur(8px)', padding: '32px 16px 60px', cursor: 'none' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 800, margin: '0 auto', background: '#FFFFFF', borderRadius: 20, overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.5), 0 0 0 1px rgba(25,25,112,0.12)' }}
      >
        {/* Hero image */}
        {heroImage && (
          <div style={{ width: '100%', height: 280, overflow: 'hidden', position: 'relative' }}>
            <img src={heroImage} alt="" onError={(e) => { (e.currentTarget as HTMLImageElement).parentElement!.style.display = 'none'; }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}

        {/* Header */}
        <div style={{ padding: '28px 36px 20px', borderBottom: '1px solid rgba(25,25,112,0.1)', position: 'relative' }}>
          <button
            onClick={onClose}
            style={{ position: 'absolute', top: 24, right: 28, width: 34, height: 34, borderRadius: 8, background: '#F4F1EC', border: '1px solid rgba(25,25,112,0.1)', color: '#7A7A9A', cursor: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#191970'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#F4F1EC'; e.currentTarget.style.color = '#7A7A9A'; }}
          >
            <X size={14} />
          </button>

          <div style={{ marginBottom: 14 }}>
            <CategoryBadge category={article.category} />
          </div>

          <h2 style={{ color: '#191970', fontSize: 'clamp(1.15rem, 2.5vw, 1.55rem)', fontWeight: 700, lineHeight: 1.4, margin: '0 0 14px', paddingRight: 44 }}>
            {article.headline}
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#191970', fontSize: 12, fontWeight: 500 }}>
              <Globe size={11} />
              <span style={{ fontFamily: 'var(--font-mono)' }}>{article.source_name}</span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#8A8AA0', fontSize: 12 }}>
              <Calendar size={11} />
              {formatDate(article.published_date)}
            </span>
          </div>
        </div>

        {/* Article body */}
        <div style={{ padding: '28px 36px', minHeight: 200, background: '#FAFAF8' }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '48px 0', color: '#8A8AA0' }}>
              <RefreshCw size={22} style={{ animation: 'spin 1s linear infinite', color: '#191970' }} />
              <span style={{ fontSize: 13 }}>Loading article…</span>
            </div>
          ) : error ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '40px 0', textAlign: 'center' }}>
              <AlertCircle size={24} color="#F99F1B" />
              <p style={{ color: '#5A5A78', fontSize: 14, margin: 0 }}>{error}</p>
              <p style={{ color: '#9A9AB0', fontSize: 12, margin: 0 }}>This article may require JavaScript or be behind a paywall.</p>
            </div>
          ) : bodyText ? (
            <div style={{ color: '#2A2A48', fontSize: 15, lineHeight: 1.9, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {bodyText}
            </div>
          ) : (
            <p style={{ color: '#8A8AA0', fontSize: 14, textAlign: 'center', padding: '32px 0' }}>
              Full content not available for this source.
            </p>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 36px', background: '#F4F1EC', borderTop: '1px solid rgba(25,25,112,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#9A9AB0', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Source: {article.source_name}
          </span>
          <span
            onClick={() => window.open(article.article_url, '_blank', 'noopener,noreferrer')}
            style={{ fontSize: 11, color: cat.text, opacity: 0.6, cursor: 'none', textDecoration: 'underline', userSelect: 'none' }}
          >
            Original article ↗
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Article Card ───────────────────────────────────────────────────────────

function ArticleCard({ article, index, onClick }: { article: Article; index: number; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const cat = CAT_COLORS[article.category] || CAT_COLORS['Board News'];

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.4), ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        background: '#FFFFFF',
        border: `1px solid ${hovered ? '#F99F1B' : 'rgba(25,25,112,0.1)'}`,
        borderRadius: 14,
        padding: '22px 24px 20px',
        display: 'flex', flexDirection: 'column', gap: 11,
        transition: 'all 0.2s ease',
        transform: hovered ? 'translateY(-4px)' : 'none',
        boxShadow: hovered
          ? '0 12px 40px rgba(25,25,112,0.12), 0 0 0 1px rgba(249,159,27,0.2)'
          : '0 1px 6px rgba(25,25,112,0.06)',
        cursor: 'none',
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <CategoryBadge category={article.category} />
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#9A9AB0', fontSize: 11 }}>
          <Calendar size={10} />
          {formatDate(article.published_date)}
        </span>
      </div>

      {/* Headline */}
      <h3 style={{
        fontSize: 15, fontWeight: 600, color: hovered ? '#191970' : '#2A2A48',
        lineHeight: 1.5, margin: 0,
        display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        transition: 'color 0.2s',
      }}>
        {article.headline}
      </h3>

      {/* Description */}
      {article.description && (
        <p style={{ fontSize: 12, color: '#6A6A88', lineHeight: 1.65, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {article.description}
        </p>
      )}

      {/* Footer */}
      <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: `1px solid ${hovered ? 'rgba(249,159,27,0.2)' : 'rgba(25,25,112,0.08)'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'border-color 0.2s' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#9A9AB0', fontSize: 11 }}>
          <Globe size={10} />
          <span style={{ fontFamily: 'var(--font-mono)' }}>{article.source_name}</span>
        </div>
        <span style={{ fontSize: 12, fontWeight: 600, color: hovered ? '#F99F1B' : cat.text, transition: 'color 0.2s' }}>
          Read More →
        </span>
      </div>
    </motion.article>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export function BoardUpdatesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const LIMIT = 12;

  const fetchArticles = useCallback(async (pg: number, cat: string, q: string, append = false) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(pg), limit: String(LIMIT), ...(cat !== 'All' && { category: cat }), ...(q && { search: q }) });
      const r = await fetch(`${API_BASE}/api/board-updates?${params}`);
      const json = await r.json();
      setArticles((prev) => append ? [...prev, ...json.data] : (json.data || []));
      setTotal(json.total || 0);
    } catch { /* leave state */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { setPage(1); fetchArticles(1, category, search, false); }, [category, search, fetchArticles]);

  const loadMore = () => { const next = page + 1; setPage(next); fetchArticles(next, category, search, true); };
  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setSearch(searchInput); };
  const hasMore = articles.length < total;

  return (
    <div style={{ background: '#08081C', minHeight: '100vh', cursor: 'none' }}>
      <CustomCursor />
      <Navbar />

      {/* Dark hero — matches site brand */}
      <section style={{
        padding: '140px 24px 80px',
        background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(25,25,112,0.55) 0%, rgba(25,25,112,0.12) 55%, #08081C 80%)',
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20, padding: '6px 14px', borderRadius: 20, background: 'rgba(249,159,27,0.08)', border: '1px solid rgba(249,159,27,0.2)' }}
          >
            <Newspaper size={12} color="#F99F1B" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#F99F1B', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Live Board Updates</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, color: '#F0EDE8', lineHeight: 1.2, marginBottom: 16, letterSpacing: '-0.02em' }}
          >
            Board & Director<br /><span style={{ color: '#F99F1B' }}>Updates in India</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
            style={{ color: '#8A8AA0', fontSize: 16, lineHeight: 1.7, maxWidth: 540, margin: '0 auto 36px' }}
          >
            Track the latest independent director appointments, board changes, and governance news across Indian corporates — curated by MentorMyBoard.
          </motion.p>

          {/* Search bar */}
          <motion.form
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
            onSubmit={handleSearch}
            style={{ display: 'flex', gap: 10, maxWidth: 480, margin: '0 auto' }}
          >
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={14} color="#5A5A6A" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search appointments, companies…"
                style={{ width: '100%', padding: '11px 14px 11px 36px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 9, color: '#F0EDE8', fontSize: 14, outline: 'none', boxSizing: 'border-box', cursor: 'none' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(249,159,27,0.5)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
              />
            </div>
            <button type="submit" style={{ padding: '11px 20px', background: '#F99F1B', color: '#0A0A0A', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: 'none', whiteSpace: 'nowrap' }}>
              Search
            </button>
          </motion.form>
        </div>
      </section>

      {/* Light content section */}
      <section style={{ background: '#F4F1EC', borderTop: '4px solid #191970', minHeight: '60vh' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '44px 24px 80px' }}>

          {/* Filter tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 36, alignItems: 'center' }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  padding: '7px 16px', borderRadius: 8, fontSize: 12, fontWeight: 500,
                  background: category === cat ? '#191970' : '#FFFFFF',
                  color: category === cat ? '#FFFFFF' : '#6A6A88',
                  border: `1px solid ${category === cat ? '#191970' : 'rgba(25,25,112,0.15)'}`,
                  cursor: 'none', transition: 'all 0.15s',
                  boxShadow: category === cat ? '0 2px 8px rgba(25,25,112,0.25)' : 'none',
                }}
                onMouseEnter={(e) => { if (category !== cat) { e.currentTarget.style.borderColor = '#191970'; e.currentTarget.style.color = '#191970'; } }}
                onMouseLeave={(e) => { if (category !== cat) { e.currentTarget.style.borderColor = 'rgba(25,25,112,0.15)'; e.currentTarget.style.color = '#6A6A88'; } }}
              >
                {cat}
              </button>
            ))}
            {total > 0 && (
              <span style={{ marginLeft: 'auto', color: '#9A9AB0', fontSize: 12, fontFamily: 'var(--font-mono)' }}>
                {total} article{total !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Cards grid */}
          {loading && articles.length === 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{ height: 200, borderRadius: 14, background: '#E8E5E0', animation: 'pulse 1.5s ease-in-out infinite' }} />
              ))}
            </div>
          ) : articles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 24px', color: '#8A8AA0' }}>
              <Newspaper size={40} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
              <p style={{ fontSize: 16, color: '#5A5A78' }}>No articles found{search ? ` for "${search}"` : ''}.</p>
              {search && (
                <button onClick={() => { setSearchInput(''); setSearch(''); }} style={{ marginTop: 12, color: '#191970', background: 'none', border: 'none', fontSize: 13, cursor: 'none', textDecoration: 'underline' }}>
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
                <AnimatePresence mode="popLayout">
                  {articles.map((article, i) => (
                    <ArticleCard key={article.id} article={article} index={i} onClick={() => setSelectedArticle(article)} />
                  ))}
                </AnimatePresence>
              </div>

              {hasMore && (
                <div style={{ textAlign: 'center', marginTop: 48 }}>
                  <button
                    onClick={loadMore} disabled={loading}
                    style={{ padding: '12px 32px', borderRadius: 10, fontSize: 14, fontWeight: 600, background: '#191970', color: '#FFFFFF', border: 'none', cursor: loading ? 'wait' : 'none', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 16px rgba(25,25,112,0.3)', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#F99F1B'; e.currentTarget.style.color = '#0A0A0A'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#191970'; e.currentTarget.style.color = '#FFFFFF'; }}
                  >
                    {loading ? <><RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> Loading…</> : `Load More (${total - articles.length} remaining)`}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Article modal */}
      <AnimatePresence>
        {selectedArticle && (
          <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
        )}
      </AnimatePresence>

      <MmbEcosystem />
      <Footer />

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.8; } }
      `}</style>
    </div>
  );
}
