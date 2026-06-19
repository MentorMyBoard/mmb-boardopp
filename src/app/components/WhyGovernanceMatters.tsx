import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "motion/react";

const stats = [
  { value: 78, suffix: "%", label: "of boardrooms globally lack diverse expertise" },
  { value: 3.2, suffix: "×", label: "better financial performance with strong governance" },
  { value: 91, suffix: "%", label: "of institutional investors favor governance disclosure" },
  { value: 2.1, suffix: "T", label: "USD in ESG assets expected by 2026" },
];

function AnimatedNumber({ target, suffix, inView }: { target: number; suffix: string; inView: boolean }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const start = Date.now();
    const isDecimal = target % 1 !== 0;

    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(parseFloat((target * eased).toFixed(isDecimal ? 1 : 0)));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target]);

  return (
    <span style={{ fontFamily: 'var(--font-display)', color: '#F99F1B' }}>
      {value}{suffix}
    </span>
  );
}

export function WhyGovernanceMatters() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="why" ref={ref} style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F8F5ED 100%)', padding: '120px 0', overflow: 'hidden', position: 'relative' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left: Editorial */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 mb-7 px-3 py-1.5 rounded-full" style={{ background: 'rgba(249,159,27,0.1)', border: '1px solid rgba(249,159,27,0.25)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#C47E0F', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Thought Leadership</span>
            </div>

            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.4rem,5vw,4rem)', fontWeight: 600, color: '#1A1A2A', lineHeight: 1.1, letterSpacing: '-0.025em', marginBottom: 28 }}>
              Why Governance{' '}
              <em style={{ color: '#F99F1B' }}>Truly</em>{' '}
              Matters.
            </h2>

            <div className="flex flex-col gap-5">
              <p style={{ color: '#4A4A5A', fontSize: 17, lineHeight: 1.75 }}>
                Strong governance is no longer optional — it is the foundation upon which lasting organizations are built. Boards that govern well protect stakeholder value, anticipate risk, and steer strategy with clarity.
              </p>
              <p style={{ color: '#4A4A5A', fontSize: 17, lineHeight: 1.75 }}>
                Yet governance capability remains uneven. The gap between what boards need to be and what they are represents the single greatest opportunity in corporate leadership today.
              </p>
              <p style={{ color: '#6A6A7A', fontSize: 15, lineHeight: 1.7, paddingLeft: 16, borderLeft: '2px solid rgba(249,159,27,0.5)' }}>
                "Governance is not about compliance. It is about culture, accountability, and the courage to ask the right questions."
              </p>
            </div>

            <div className="mt-10">
              <button
                style={{
                  background: '#F99F1B',
                  color: '#0A0A0A',
                  fontSize: 13,
                  fontWeight: 600,
                  padding: '13px 26px',
                  borderRadius: 9,
                  border: 'none',
                  cursor: 'none',
                  boxShadow: '0 0 24px rgba(249,159,27,0.3)',
                  transition: 'box-shadow 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 40px rgba(249,159,27,0.5)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 0 24px rgba(249,159,27,0.3)'; }}
              >
                Read Our Governance Perspectives →
              </button>
            </div>
          </motion.div>

          {/* Right: Stats */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 gap-5"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.12 }}
                className="p-6 rounded-2xl"
                style={{
                  background: 'rgba(255,255,255,0.8)',
                  border: '1px solid rgba(0,0,0,0.06)',
                  backdropFilter: 'blur(16px)',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.95)';
                  e.currentTarget.style.borderColor = 'rgba(249,159,27,0.3)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(249,159,27,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.8)';
                  e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)';
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.05)';
                }}
              >
                <div style={{ fontSize: 'clamp(2rem,4vw,2.8rem)', lineHeight: 1, marginBottom: 10 }}>
                  <AnimatedNumber target={stat.value} suffix={stat.suffix} inView={inView} />
                </div>
                <p style={{ color: '#5A5A6A', fontSize: 12, lineHeight: 1.5 }}>{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
