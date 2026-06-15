import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Clock, ArrowUpRight } from "lucide-react";

const articles = [
  {
    category: "Board Strategy",
    title: "Rethinking the Role of the Independent Director in a Volatile World",
    excerpt: "As geopolitical turbulence reshapes business landscapes, independent directors must evolve from compliance gatekeepers to strategic risk navigators.",
    readTime: "8 min read",
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop&auto=format",
    featured: true,
  },
  {
    category: "ESG Governance",
    title: "Board-Level ESG: From Reporting to Real Accountability",
    excerpt: "Why ESG mandates must be anchored in board governance structures, not delegated to management alone.",
    readTime: "6 min read",
    img: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=400&h=280&fit=crop&auto=format",
    featured: false,
  },
  {
    category: "Board Effectiveness",
    title: "The Quiet Crisis: Why 60% of Boards Are Operating Below Potential",
    excerpt: "A deep dive into the structural, behavioral, and compositional gaps undermining board effectiveness.",
    readTime: "10 min read",
    img: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=280&fit=crop&auto=format",
    featured: false,
  },
  {
    category: "Leadership",
    title: "From C-Suite to Boardroom: The Transition No One Prepares You For",
    excerpt: "Senior executives stepping into board roles face a profound shift in mindset, responsibility, and impact.",
    readTime: "7 min read",
    img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=280&fit=crop&auto=format",
    featured: false,
  },
];

export function InsightsKnowledge() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="insights" ref={ref} style={{ background: 'linear-gradient(180deg, #0F172A 0%, #0A0A0A 60%)', padding: '120px 0' }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14"
        >
          <div>
            <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full" style={{ background: 'rgba(249,159,27,0.08)', border: '1px solid rgba(249,159,27,0.2)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#F99F1B', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Governance Intelligence</span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4.5vw,3.5rem)', fontWeight: 400, color: '#F5F0E8', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
              Insights & <em style={{ fontStyle: 'italic', color: '#F99F1B' }}>Knowledge</em>
            </h2>
          </div>
          <button
            style={{
              background: 'transparent',
              color: '#F99F1B',
              fontSize: 13,
              fontWeight: 500,
              padding: '10px 20px',
              borderRadius: 8,
              border: '1px solid rgba(249,159,27,0.3)',
              cursor: 'none',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(249,159,27,0.08)'; e.currentTarget.style.borderColor = '#F99F1B'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(249,159,27,0.3)'; }}
          >
            View All Perspectives →
          </button>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Featured Article */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="lg:row-span-2 group relative rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              cursor: 'none',
              transition: 'all 0.35s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(249,159,27,0.3)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 24px 60px rgba(0,0,0,0.4)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div className="relative overflow-hidden" style={{ height: 260 }}>
              <img src={articles[0].img} alt={articles[0].title} className="w-full h-full object-cover" style={{ transition: 'transform 0.5s', }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.8) 0%, transparent 60%)' }} />
              <div className="absolute top-4 left-4">
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#F99F1B', background: 'rgba(249,159,27,0.15)', padding: '4px 10px', borderRadius: 4, border: '1px solid rgba(249,159,27,0.25)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {articles[0].category}
                </span>
              </div>
            </div>
            <div className="p-7">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1.5" style={{ color: '#5A5A6A' }}>
                  <Clock size={11} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10 }}>{articles[0].readTime}</span>
                </div>
                <ArrowUpRight size={15} color="#3A3A4A" />
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 500, color: '#F5F0E8', lineHeight: 1.25, marginBottom: 12 }}>
                {articles[0].title}
              </h3>
              <p style={{ color: '#6A6A7A', fontSize: 13, lineHeight: 1.65 }}>{articles[0].excerpt}</p>
            </div>
          </motion.div>

          {/* Smaller articles */}
          {articles.slice(1).map((article, i) => (
            <motion.div
              key={article.title}
              initial={{ opacity: 0, x: 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.1 }}
              className="group flex gap-5 rounded-2xl p-5 overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                cursor: 'none',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(249,159,27,0.05)'; e.currentTarget.style.borderColor = 'rgba(249,159,27,0.25)'; e.currentTarget.style.transform = 'translateX(3px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateX(0)'; }}
            >
              <div className="flex-shrink-0 rounded-xl overflow-hidden" style={{ width: 100, height: 90 }}>
                <img src={article.img} alt={article.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#F99F1B', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{article.category}</span>
                  <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#3A3A4A' }} />
                  <div className="flex items-center gap-1" style={{ color: '#4A4A5A' }}>
                    <Clock size={9} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9 }}>{article.readTime}</span>
                  </div>
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 500, color: '#E5E0D8', lineHeight: 1.3, marginBottom: 6 }}>
                  {article.title}
                </h3>
                <p style={{ color: '#5A5A6A', fontSize: 12, lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {article.excerpt}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
