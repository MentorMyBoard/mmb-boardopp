import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, RefreshCw, Newspaper, Calendar, Globe, X, ArrowUpRight, AlertCircle } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { MmbEcosystem } from "../components/MmbEcosystem";

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

function CategoryBadge({ category }: { category: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    'Board Appointment': { bg: 'rgba(77,184,150,0.12)',  text: '#4DB896' },
    'Board Change':      { bg: 'rgba(249,159,27,0.12)',  text: '#F99F1B' },
    'Governance':        { bg: 'rgba(123,140,222,0.12)', text: '#7B8CDE' },
    'ESG':               { bg: 'rgba(199,125,255,0.12)', text: '#C77DFF' },
    'Board News':        { bg: 'rgba(138,138,160,0.12)', text: '#8A8AA0' },
  };
  const c = colors[category] || colors['Board News'];
  return (
    <span style={{ display: 'inline-block', padding: '3px 9px', borderRadius: 5, background: c.bg, color: c.text, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
      {category}
    </span>
  );
}

// ── Article Modal ──────────────────────────────────────────────────────────

function ArticleModal({ article, onClose }: { article: Article; onClose: () => void }) {
  const [content, setContent] = useState<ArticleContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

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
    setLoading(true);
    setError('');
    fetch(`${API_BASE}/api/board-updates/content?url=${encodeURIComponent(article.article_url)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError('This article content could not be loaded.');
        else setContent(data);
      })
      .catch(() => setError('Failed to load content. Please try again.'))
      .finally(() => setLoading(false));
  }, [article.article_url]);

  const heroImage = content?.ogImage || article.image_url || '';
  const bodyText = content?.content || content?.ogDescription || article.description || '';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        style={{ position: 'fixed', inset: 0, background: 'rgba(4,4,18,0.92)', zIndex: 2000, overflowY: 'auto', backdropFilter: 'blur(6px)', padding: '24px 16px 40px' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          ref={scrollRef}
          onClick={(e) => e.stopPropagation()}
          style={{
            maxWidth: 780, margin: '0 auto',
            background: '#0E0E28',
            border: '1px solid rgba(25,25,112,0.45)',
            borderRadius: 20,
            overflow: 'hidden',
            boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
          }}
        >
          {/* Hero image */}
          {heroImage && (
            <div style={{ width: '100%', height: 260, overflow: 'hidden', position: 'relative' }}>
              <img
                src={heroImage}
                alt=""
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(14,14,40,0) 40%, #0E0E28 100%)' }} />
            </div>
          )}

          {/* Header */}
          <div style={{ padding: heroImage ? '20px 32px 16px' : '28px 32px 16px', position: 'relative' }}>
            {/* Close button */}
            <button
              onClick={onClose}
              style={{ position: 'absolute', top: heroImage ? 20 : 24, right: 24, width: 34, height: 34, borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#8A8AA0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,107,107,0.12)'; e.currentTarget.style.color = '#FF6B6B'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#8A8AA0'; }}
            >
              <X size={15} />
            </button>

            <div style={{ marginBottom: 12 }}>
              <CategoryBadge category={article.category} />
            </div>

            <h2 style={{ color: '#F0EDE8', fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)', fontWeight: 700, lineHeight: 1.4, margin: '0 0 12px', paddingRight: 40 }}>
              {article.headline}
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: '#5A5A6A', fontSize: 12, flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Globe size={11} />
                <span style={{ fontFamily: 'var(--font-mono)', color: '#7B8CDE' }}>{article.source_name}</span>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Calendar size={11} />
                {formatDate(article.published_date)}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(25,25,112,0.35)', margin: '0 32px' }} />

          {/* Content */}
          <div style={{ padding: '24px 32px 32px', minHeight: 200 }}>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: '40px 0', color: '#5A5A6A' }}>
                <RefreshCw size={22} style={{ animation: 'spin 1s linear infinite', color: '#7B8CDE' }} />
                <span style={{ fontSize: 13 }}>Loading article content…</span>
              </div>
            ) : error ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '32px 0', textAlign: 'center' }}>
                <AlertCircle size={24} color="#F99F1B" style={{ opacity: 0.6 }} />
                <p style={{ color: '#7A7A9A', fontSize: 14, margin: 0 }}>{error}</p>
                <p style={{ color: '#5A5A6A', fontSize: 12, margin: 0 }}>This article may be behind a paywall or require JavaScript.</p>
              </div>
            ) : (
              <div>
                {bodyText ? (
                  <div
                    style={{
                      color: '#B8B4AF', fontSize: 15, lineHeight: 1.85,
                      whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                    }}
                  >
                    {bodyText}
                  </div>
                ) : (
                  <p style={{ color: '#5A5A6A', fontSize: 14, fontStyle: 'normal' }}>
                    Full content could not be extracted from this source.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Footer — attribution only, no prominent link */}
          <div style={{ padding: '14px 32px', borderTop: '1px solid rgba(25,25,112,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#3A3A5A', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Source: {article.source_name}
            </span>
            <a
              href={article.article_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#3A3A5A', fontSize: 11, textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#5A5A7A'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#3A3A5A'; }}
            >
              Original <ArrowUpRight size={10} />
            </a>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Article Card ───────────────────────────────────────────────────────────

function ArticleCard({ article, index, onClick }: { article: Article; index: number; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        background: hovered ? 'rgba(25,25,112,0.12)' : '#0E0E28',
        border: `1px solid ${hovered ? 'rgba(249,159,27,0.35)' : 'rgba(25,25,112,0.3)'}`,
        borderRadius: 14, padding: '22px 24px',
        display: 'flex', flexDirection: 'column', gap: 12,
        transition: 'all 0.2s ease',
        transform: hovered ? 'translateY(-3px)' : 'none',
        boxShadow: hovered ? '0 12px 40px rgba(0,0,0,0.4)' : 'none',
        cursor: 'pointer',
      }}
    >
      {/* Top row: category + date */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <CategoryBadge category={article.category} />
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#5A5A6A', fontSize: 11 }}>
          <Calendar size={10} />
          {formatDate(article.published_date)}
        </span>
      </div>

      {/* Headline */}
      <h3 style={{
        fontSize: 15, fontWeight: 600, color: hovered ? '#F5F0E8' : '#D8D4CC',
        lineHeight: 1.5, margin: 0,
        display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        transition: 'color 0.2s',
      }}>
        {article.headline}
      </h3>

      {/* Description */}
      {article.description && (
        <p style={{ fontSize: 12, color: '#6A6A7A', lineHeight: 1.65, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {article.description}
        </p>
      )}

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#5A5A6A', fontSize: 11 }}>
          <Globe size={10} />
          <span style={{ fontFamily: 'var(--font-mono)' }}>{article.source_name}</span>
        </div>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: hovered ? '#F99F1B' : '#6A6A7A', fontSize: 12, fontWeight: 500, transition: 'color 0.2s' }}>
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
      const params = new URLSearchParams({
        page: String(pg), limit: String(LIMIT),
        ...(cat !== 'All' && { category: cat }),
        ...(q && { search: q }),
      });
      const r = await fetch(`${API_BASE}/api/board-updates?${params}`);
      const json = await r.json();
      setArticles((prev) => append ? [...prev, ...json.data] : json.data);
      setTotal(json.total || 0);
    } catch {
      // leave state on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    fetchArticles(1, category, search, false);
  }, [category, search, fetchArticles]);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchArticles(next, category, search, true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const hasMore = articles.length < total;

  return (
    <div style={{ background: '#08081C', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <section style={{
        padding: '140px 24px 80px',
        background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(25,25,112,0.55) 0%, rgba(25,25,112,0.1) 55%, #08081C 80%)',
        borderBottom: '1px solid rgba(25,25,112,0.25)',
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
            style={{ color: '#7A7A9A', fontSize: 16, lineHeight: 1.7, maxWidth: 560, margin: '0 auto 36px' }}
          >
            Track the latest independent director appointments, board changes, and governance news across Indian corporates — curated by MentorMyBoard.
          </motion.p>

          {/* Search */}
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
                style={{ width: '100%', padding: '11px 14px 11px 36px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 9, color: '#F0EDE8', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(249,159,27,0.5)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
              />
            </div>
            <button type="submit" style={{ padding: '11px 20px', background: '#F99F1B', color: '#0A0A0A', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              Search
            </button>
          </motion.form>
        </div>
      </section>

      {/* Content */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 80px' }}>
        {/* Filter tabs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 36 }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                padding: '7px 16px', borderRadius: 8, fontSize: 12, fontWeight: 500,
                background: category === cat ? '#F99F1B' : 'rgba(255,255,255,0.04)',
                color: category === cat ? '#0A0A0A' : '#8A8AA0',
                border: category === cat ? 'none' : '1px solid rgba(255,255,255,0.08)',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => { if (category !== cat) { e.currentTarget.style.borderColor = 'rgba(249,159,27,0.3)'; e.currentTarget.style.color = '#F99F1B'; } }}
              onMouseLeave={(e) => { if (category !== cat) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#8A8AA0'; } }}
            >
              {cat}
            </button>
          ))}
          {total > 0 && (
            <span style={{ marginLeft: 'auto', color: '#5A5A6A', fontSize: 12, alignSelf: 'center' }}>
              {total} article{total !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Cards grid */}
        {loading && articles.length === 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ height: 200, borderRadius: 14, background: '#0E0E28', border: '1px solid rgba(25,25,112,0.2)', animation: 'pulse 1.5s ease-in-out infinite' }} />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px', color: '#5A5A6A' }}>
            <Newspaper size={40} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
            <p style={{ fontSize: 16 }}>No articles found{search ? ` for "${search}"` : ''}.</p>
            {search && (
              <button onClick={() => { setSearchInput(''); setSearch(''); }} style={{ marginTop: 12, color: '#F99F1B', background: 'none', border: 'none', fontSize: 13, cursor: 'pointer' }}>
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
                  style={{ padding: '12px 32px', borderRadius: 10, fontSize: 14, fontWeight: 500, background: 'transparent', color: '#F99F1B', border: '1px solid rgba(249,159,27,0.4)', cursor: loading ? 'wait' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'all 0.2s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(249,159,27,0.06)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  {loading ? <><RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> Loading…</> : `Load More (${total - articles.length} remaining)`}
                </button>
              </div>
            )}
          </>
        )}
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
        @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.7; } }
      `}</style>
    </div>
  );
}
