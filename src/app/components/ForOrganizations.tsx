import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Users, Network, TrendingUp, BarChart3, Leaf, Star } from "lucide-react";

const services = [
  {
    icon: Users,
    title: "Board Building",
    desc: "Identify, evaluate, and onboard the right independent directors and advisors for your board.",
  },
  {
    icon: Network,
    title: "Advisory Boards",
    desc: "Constitute expert advisory panels to strengthen strategic guidance and domain depth.",
  },
  {
    icon: TrendingUp,
    title: "Governance Consulting",
    desc: "Transform governance frameworks, committee charters, and board operating models.",
  },
  {
    icon: BarChart3,
    title: "Board Effectiveness",
    desc: "Conduct rigorous board evaluations to unlock collective performance improvements.",
  },
  {
    icon: Leaf,
    title: "ESG Governance",
    desc: "Embed environmental, social, and governance mandates into the board's core agenda.",
  },
  {
    icon: Star,
    title: "Leadership Advisory",
    desc: "C-suite and board-level coaching to elevate governance consciousness at the top.",
  },
];

export function ForOrganizations() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="organizations" ref={ref} style={{ background: '#08081C', padding: '120px 0' }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16"
        >
          <div>
            <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full" style={{ background: 'rgba(249,159,27,0.08)', border: '1px solid rgba(249,159,27,0.2)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#F99F1B', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Enterprise Solutions</span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4.5vw,3.5rem)', fontWeight: 600, color: '#F5F0E8', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
              For <em style={{ color: '#F99F1B' }}>Organizations</em>
            </h2>
            <p style={{ color: '#6A6A7A', fontSize: 16, lineHeight: 1.6, maxWidth: 460, marginTop: 12 }}>
              End-to-end governance solutions for companies that take boardroom excellence seriously.
            </p>
          </div>
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
              whiteSpace: 'nowrap',
              boxShadow: '0 0 24px rgba(249,159,27,0.3)',
              transition: 'box-shadow 0.2s, transform 0.2s',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 40px rgba(249,159,27,0.5)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 0 24px rgba(249,159,27,0.3)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Post a Board Requirement →
          </button>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.08 }}
              className="group p-6 rounded-2xl"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(16px)',
                transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
                cursor: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(249,159,27,0.06)';
                e.currentTarget.style.borderColor = 'rgba(249,159,27,0.25)';
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 20px 50px rgba(249,159,27,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{
                  background: 'rgba(249,159,27,0.1)',
                  border: '1px solid rgba(249,159,27,0.2)',
                  transition: 'all 0.3s',
                }}
              >
                <service.icon size={20} color="#F99F1B" />
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 500, color: '#F5F0E8', marginBottom: 8, lineHeight: 1.2 }}>
                {service.title}
              </h3>
              <p style={{ color: '#6A6A7A', fontSize: 13, lineHeight: 1.65 }}>{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
