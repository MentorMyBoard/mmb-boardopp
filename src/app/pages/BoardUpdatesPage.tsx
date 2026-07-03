import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, Search, RefreshCw, Newspaper, Calendar, Globe } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { MmbEcosystem } from "../components/MmbEcosystem";

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return iso;
  }
}

function CategoryBadge({ category }: { category: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    'Board Appointment': { bg: 'rgba(77,184,150,0.12)', text: '#4DB896' },
    'Board Change':      { bg: 'rgba(249,159,27,0.12)',  text: '#F99F1B' },
    'Governance':        { bg: 'rgba(123,140,222,0.12)', text: '#7B8CDE' },
    'ESG':               { bg: 'rgba(199,125,255,0.12)', text: '#C77DFF' },
    'Board News':        { bg: 'rgba(138,138,160,0.12)', text: '#8A8AA0' },
  };
  const c = colors[category] || colors['Board News'];
  return (
    <span style={{
      display: 'inline-block', padding: '2px 8px', borderRadius: 4,
      background: c.bg, color: c.text,
      fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase',
    }}>
      {category}
    </span>
  );
}

function ArticleCard({ article, index }: { article: Article; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(25,25,112,0.12)' : '#0E0E28',
        border: `1px solid ${hovered ? 'rgba(249,159,27,0.35)' : 'rgba(25,25,112,0.3)'}`,
        borderRadius: 14,
        padding: '22px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        transition: 'all 0.2s ease',
        transform: hovered ? 'translateY(-3px)' : 'none',
        boxShadow: hovered ? '0 12px 40px rgba(0,0,0,0.4)' : 'none',
        cursor: 'none',
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
        <p style={{
          fontSize: 12, color: '#6A6A7A', lineHeight: 1.65, margin: 0,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {article.description}
        </p>
      )}

      {/* Footer: source + read link */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#5A5A6A', fontSize: 11 }}>
          <Globe size={10} />
          <span style={{ fontFamily: 'var(--font-mono)' }}>{article.source_name}</span>
        </div>
        <a
          href={article.article_url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            color: '#F99F1B', fontSize: 12, fontWeight: 500, textDecoration: 'none',
            transition: 'gap 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.gap = '6px'; }}
          onMouseLeave={(e) => { e.currentTarget.style.gap = '4px'; }}
        >
          Read Article <ArrowUpRight size={12} />
        </a>
      </div>
    </motion.article>
  );
}

export function BoardUpdatesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

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
      // leave current state on network error
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
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20, padding: '6px 14px', borderRadius: 20, background: 'rgba(249,159,27,0.08)', border: '1px solid rgba(249,159,27,0.2)' }}
          >
            <Newspaper size={12} color="#F99F1B" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#F99F1B', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Live Board Updates</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, color: '#F0EDE8', lineHeight: 1.2, marginBottom: 16, letterSpacing: '-0.02em' }}
          >
            Board & Director<br />
            <span style={{ color: '#F99F1B' }}>Updates in India</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{ color: '#7A7A9A', fontSize: 16, lineHeight: 1.7, maxWidth: 560, margin: '0 auto 36px' }}
          >
            Track the latest independent director appointments, board changes, and governance news across Indian corporates — curated by MentorMyBoard.
          </motion.p>

          {/* Search */}
          <motion.form
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            onSubmit={handleSearch}
            style={{ display: 'flex', gap: 10, maxWidth: 480, margin: '0 auto' }}
          >
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={14} color="#5A5A6A" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search appointments, companies…"
                style={{
                  width: '100%', padding: '11px 14px 11px 36px',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 9, color: '#F0EDE8', fontSize: 14, outline: 'none',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(249,159,27,0.5)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
              />
            </div>
            <button
              type="submit"
              style={{ padding: '11px 20px', background: '#F99F1B', color: '#0A0A0A', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
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
              <button
                onClick={() => { setSearchInput(''); setSearch(''); }}
                style={{ marginTop: 12, color: '#F99F1B', background: 'none', border: 'none', fontSize: 13, cursor: 'pointer' }}
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
              <AnimatePresence mode="popLayout">
                {articles.map((article, i) => (
                  <ArticleCard key={article.id} article={article} index={i} />
                ))}
              </AnimatePresence>
            </div>

            {/* Load more */}
            {hasMore && (
              <div style={{ textAlign: 'center', marginTop: 48 }}>
                <button
                  onClick={loadMore}
                  disabled={loading}
                  style={{
                    padding: '12px 32px', borderRadius: 10, fontSize: 14, fontWeight: 500,
                    background: 'transparent', color: '#F99F1B',
                    border: '1px solid rgba(249,159,27,0.4)', cursor: loading ? 'wait' : 'pointer',
                    display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'all 0.2s',
                  }}
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

      <MmbEcosystem />
      <Footer />

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.7; } }
      `}</style>
    </div>
  );
}
