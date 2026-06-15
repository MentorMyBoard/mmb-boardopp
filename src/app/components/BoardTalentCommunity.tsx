import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "motion/react";
import { community as communityStore } from "../utils/store";

const badgeStyle = (badge: string) => {
  if (badge.includes("ESG")) return { bg: 'rgba(95,207,138,0.1)', color: '#5FCF8A', border: 'rgba(95,207,138,0.2)' };
  if (badge.includes("Advisor")) return { bg: 'rgba(136,144,255,0.1)', color: '#8890FF', border: 'rgba(136,144,255,0.2)' };
  if (badge.includes("Independent")) return { bg: 'rgba(249,159,27,0.1)', color: '#F99F1B', border: 'rgba(249,159,27,0.2)' };
  if (badge.includes("Committee")) return { bg: 'rgba(240,160,100,0.1)', color: '#F0A064', border: 'rgba(240,160,100,0.2)' };
  if (badge.includes("Veteran")) return { bg: 'rgba(100,180,220,0.1)', color: '#64B4DC', border: 'rgba(100,180,220,0.2)' };
  return { bg: 'rgba(249,159,27,0.1)', color: '#F99F1B', border: 'rgba(249,159,27,0.2)' };
};

export function BoardTalentCommunity() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [professionals, setProfessionals] = useState(() =>
    communityStore.getActive().map((m) => ({
      name: m.name, title: m.designation, company: m.industry, expertise: m.expertise,
      badge: m.badges[0] || 'Governance Professional', img: m.photo, yrs: m.experience,
    }))
  );

  useEffect(() => {
    const data = communityStore.getActive().map((m) => ({
      name: m.name, title: m.designation, company: m.industry, expertise: m.expertise,
      badge: m.badges[0] || 'Governance Professional', img: m.photo, yrs: m.experience,
    }));
    if (data.length) setProfessionals(data);
  }, []);

  return (
    <section id="community" ref={ref} style={{ background: 'linear-gradient(180deg, #F8F5ED 0%, #F0EBE0 100%)', padding: '120px 0', position: 'relative', overflow: 'hidden' }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full" style={{ background: 'rgba(249,159,27,0.1)', border: '1px solid rgba(249,159,27,0.25)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#C47E0F', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Governance Community</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4.5vw,3.5rem)', fontWeight: 400, color: '#1A1A2A', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
            Board Talent <em style={{ fontStyle: 'italic', color: '#F99F1B' }}>Community</em>
          </h2>
          <p style={{ color: '#5A5A6A', fontSize: 16, lineHeight: 1.6, maxWidth: 480, margin: '16px auto 0' }}>
            An exclusive network of governance professionals shaping the future of boardrooms.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {professionals.map((person, i) => {
            const bs = badgeStyle(person.badge);
            return (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.08 }}
                className="group relative rounded-2xl p-6 overflow-hidden"
                style={{
                  background: 'rgba(255,255,255,0.8)',
                  border: '1px solid rgba(0,0,0,0.06)',
                  backdropFilter: 'blur(16px)',
                  boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
                  transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
                  cursor: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.95)';
                  e.currentTarget.style.borderColor = 'rgba(249,159,27,0.3)';
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 24px 60px rgba(249,159,27,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.8)';
                  e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.06)';
                }}
              >
                <div className="flex items-start gap-4 mb-5">
                  <img
                    src={person.img}
                    alt={person.name}
                    className="w-14 h-14 rounded-xl object-cover"
                    style={{ border: '2px solid rgba(249,159,27,0.2)' }}
                  />
                  <div className="flex-1 min-w-0">
                    <div style={{ color: '#1A1A2A', fontSize: 15, fontWeight: 600, marginBottom: 2 }}>{person.name}</div>
                    <div style={{ color: '#5A5A6A', fontSize: 12, marginBottom: 3 }}>{person.title}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#8A8A9A' }}>{person.company}</div>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#F99F1B', background: 'rgba(249,159,27,0.08)', padding: '2px 6px', borderRadius: 4, whiteSpace: 'nowrap' }}>
                    {person.yrs}
                  </div>
                </div>

                {/* Badge */}
                <div className="mb-4">
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      padding: '4px 10px',
                      borderRadius: 5,
                      background: bs.bg,
                      color: bs.color,
                      border: `1px solid ${bs.border}`,
                      letterSpacing: '0.06em',
                    }}
                  >
                    {person.badge}
                  </span>
                </div>

                {/* Expertise tags */}
                <div className="flex flex-wrap gap-1.5">
                  {person.expertise.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: 11,
                        color: '#5A5A6A',
                        background: 'rgba(0,0,0,0.04)',
                        border: '1px solid rgba(0,0,0,0.08)',
                        padding: '3px 8px',
                        borderRadius: 4,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center mt-12"
        >
          <button
            style={{
              background: 'linear-gradient(135deg, #F99F1B, #FFD36A)',
              color: '#0A0A0A',
              fontSize: 13,
              fontWeight: 600,
              padding: '13px 28px',
              borderRadius: 9,
              border: 'none',
              cursor: 'none',
              boxShadow: '0 4px 20px rgba(249,159,27,0.3)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(249,159,27,0.5)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(249,159,27,0.3)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Join the Governance Community →
          </button>
        </motion.div>
      </div>
    </section>
  );
}
