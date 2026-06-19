import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { ArrowUpRight } from "lucide-react";

const sites = [
  {
    name: "MentorMyBoard",
    url: "https://mentormyboard.com",
    display: "mentormyboard.com",
    tagline: "The Main Hub",
    description: "India's premier platform for board mentoring, governance learning, and professional development for aspiring and practicing directors.",
    accent: "#F99F1B",
    accentBg: "rgba(249,159,27,0.08)",
    accentBorder: "rgba(249,159,27,0.25)",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="13" stroke="#F99F1B" strokeWidth="1.5" />
        <path d="M8 18L14 9l6 9" stroke="#F99F1B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10.5 15h7" stroke="#F99F1B" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "Board Education",
    url: "https://boardedu.mentormyboard.com",
    display: "boardedu.mentormyboard.com",
    tagline: "Director Learning",
    description: "Structured certification programs, workshops, and masterclasses designed to prepare professionals for independent director roles.",
    accent: "#7B8CDE",
    accentBg: "rgba(123,140,222,0.08)",
    accentBorder: "rgba(123,140,222,0.25)",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="4" y="8" width="20" height="14" rx="2" stroke="#7B8CDE" strokeWidth="1.5" />
        <path d="M9 8V6a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2" stroke="#7B8CDE" strokeWidth="1.5" />
        <path d="M14 12v6M11 15h6" stroke="#7B8CDE" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "Board Consulting",
    url: "https://consulting.mentormyboard.com",
    display: "consulting.mentormyboard.com",
    tagline: "Governance Advisory",
    description: "Expert consulting services helping organizations design governance frameworks, evaluate board effectiveness, and strengthen leadership structures.",
    accent: "#4DB896",
    accentBg: "rgba(77,184,150,0.08)",
    accentBorder: "rgba(77,184,150,0.25)",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M5 21l6-6 4 4 8-10" stroke="#4DB896" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="23" cy="5" r="2" stroke="#4DB896" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    name: "WOMB Circle",
    url: "https://mmbwombcircle.com",
    display: "mmbwombcircle.com",
    tagline: "Women on Mainstream Board",
    description: "A dedicated platform empowering women professionals to access, prepare for, and secure meaningful positions on corporate and institutional boards.",
    accent: "#C77DFF",
    accentBg: "rgba(199,125,255,0.08)",
    accentBorder: "rgba(199,125,255,0.25)",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="10" r="5" stroke="#C77DFF" strokeWidth="1.5" />
        <path d="M14 15v8M10 19h8" stroke="#C77DFF" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M5 22c0-3.314 4.03-6 9-6s9 2.686 9 6" stroke="#C77DFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      </svg>
    ),
  },
];

export function MmbEcosystem() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      id="mmb-ecosystem"
      ref={ref}
      style={{
        background: 'linear-gradient(180deg, #08081C 0%, #0E0E2E 50%, #08081C 100%)',
        padding: '100px 0 120px',
        borderTop: '1px solid rgba(25,25,112,0.3)',
      }}
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <div
            className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(25,25,112,0.3)', border: '1px solid rgba(25,25,112,0.5)' }}
          >
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#191970', boxShadow: '0 0 6px rgba(25,25,112,0.8)' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#7B8CDE', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              The MMB Ecosystem
            </span>
          </div>

          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 700, color: '#F0EDE8', lineHeight: 1.2, marginBottom: 14 }}>
            Explore All <span style={{ color: '#F99F1B' }}>MentorMyBoard</span> Verticals
          </h2>
          <p style={{ color: '#7A7A9A', fontSize: 16, lineHeight: 1.65, maxWidth: 520, margin: '0 auto' }}>
            BoardOpp is one part of a larger ecosystem dedicated to building India's governance leadership. Discover the full platform.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {sites.map((site, i) => (
            <motion.a
              key={site.name}
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                background: '#0E0E28',
                border: `1px solid ${site.accentBorder}`,
                borderRadius: 16,
                padding: '28px 24px',
                textDecoration: 'none',
                cursor: 'none',
                transition: 'all 0.25s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'translateY(-4px)';
                el.style.background = site.accentBg;
                el.style.borderColor = site.accent;
                el.style.boxShadow = `0 12px 40px rgba(0,0,0,0.4), 0 0 30px ${site.accentBg}`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'translateY(0)';
                el.style.background = '#0E0E28';
                el.style.borderColor = site.accentBorder;
                el.style.boxShadow = 'none';
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: 52, height: 52, borderRadius: 12,
                  background: site.accentBg,
                  border: `1px solid ${site.accentBorder}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 20, flexShrink: 0,
                }}
              >
                {site.icon}
              </div>

              {/* Tagline badge */}
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: site.accent, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8, opacity: 0.85 }}>
                {site.tagline}
              </div>

              {/* Name */}
              <div style={{ fontSize: 17, fontWeight: 700, color: '#F0EDE8', marginBottom: 10, lineHeight: 1.3 }}>
                {site.name}
              </div>

              {/* Description */}
              <p style={{ fontSize: 13, color: '#7A7A9A', lineHeight: 1.65, flex: 1, marginBottom: 20 }}>
                {site.description}
              </p>

              {/* URL + Arrow */}
              <div className="flex items-center justify-between" style={{ paddingTop: 16, borderTop: `1px solid ${site.accentBorder}` }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: site.accent, letterSpacing: '0.04em', opacity: 0.8 }}>
                  {site.display}
                </span>
                <div
                  style={{
                    width: 28, height: 28, borderRadius: 7,
                    background: site.accentBg,
                    border: `1px solid ${site.accentBorder}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <ArrowUpRight size={13} color={site.accent} />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
