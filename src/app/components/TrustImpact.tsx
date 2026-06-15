import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "motion/react";

const counters = [
  { value: 500, suffix: "+", label: "Organizations Served", sub: "Across 18 industries" },
  { value: 2000, suffix: "+", label: "Governance Professionals", sub: "In our network" },
  { value: 150, suffix: "+", label: "Programs Conducted", sub: "By MentorMyBoard" },
  { value: 1200, suffix: "+", label: "Board Opportunities", sub: "Facilitated to date" },
];

function Counter({ value, suffix, inView }: { value: number; suffix: string; inView: boolean }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const duration = 2200;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.floor(value * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value]);

  return (
    <span>
      {current.toLocaleString()}{suffix}
    </span>
  );
}

export function TrustImpact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="impact"
      ref={ref}
      style={{
        background: 'linear-gradient(135deg, #F0EBE0 0%, #FAF8F4 50%, #EDE8DE 100%)',
        padding: '120px 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(249,159,27,0.08) 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full" style={{ background: 'rgba(249,159,27,0.1)', border: '1px solid rgba(249,159,27,0.25)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#C47E0F', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Our Impact</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4.5vw,3.5rem)', fontWeight: 400, color: '#1A1A2A', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
            Trust & <em style={{ fontStyle: 'italic', color: '#F99F1B' }}>Impact</em>
          </h2>
          <p style={{ color: '#5A5A6A', fontSize: 16, lineHeight: 1.6, maxWidth: 460, margin: '16px auto 0' }}>
            Numbers that reflect a decade of governance leadership across India's corporate landscape.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {counters.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.1 }}
              className="text-center p-8 rounded-2xl"
              style={{
                background: 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(0,0,0,0.06)',
                backdropFilter: 'blur(16px)',
                boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.95)';
                e.currentTarget.style.borderColor = 'rgba(249,159,27,0.3)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(249,159,27,0.15)';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.7)';
                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)';
                e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontStyle: 'italic',
                  fontSize: 'clamp(2.5rem,5vw,3.5rem)',
                  fontWeight: 400,
                  lineHeight: 1,
                  marginBottom: 10,
                  background: 'linear-gradient(135deg, #F99F1B, #FFD36A)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                <Counter value={item.value} suffix={item.suffix} inView={inView} />
              </div>
              <div style={{ color: '#1A1A2A', fontSize: 15, fontWeight: 500, marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#8A8A9A', letterSpacing: '0.06em' }}>{item.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
