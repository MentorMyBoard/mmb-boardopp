import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Search, BarChart, Link2, Star } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Discover",
    subtitle: "Find your path",
    icon: Search,
    desc: "Explore curated board opportunities and governance roles matched to your profile and expertise.",
    color: "#F99F1B",
  },
  {
    number: "02",
    title: "Assess",
    subtitle: "Know your readiness",
    icon: BarChart,
    desc: "Take structured assessments to understand your boardroom readiness and identify areas for growth.",
    color: "#FFD36A",
  },
  {
    number: "03",
    title: "Connect",
    subtitle: "Build relationships",
    icon: Link2,
    desc: "Engage with organizations seeking governance professionals and join an exclusive leadership network.",
    color: "#F99F1B",
  },
  {
    number: "04",
    title: "Grow",
    subtitle: "Lead with impact",
    icon: Star,
    desc: "Continuously develop your board capabilities through MentorMyBoard programs and peer learning.",
    color: "#FFD36A",
  },
];

export function BoardroomJourney() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="journey" ref={ref} style={{ background: '#0A0A0A', padding: '120px 0' }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full" style={{ background: 'rgba(249,159,27,0.08)', border: '1px solid rgba(249,159,27,0.2)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#F99F1B', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Your governance path</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4.5vw,3.5rem)', fontWeight: 400, color: '#F5F0E8', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
            The <em style={{ fontStyle: 'italic', color: '#F99F1B' }}>Boardroom</em> Journey
          </h2>
          <p style={{ color: '#6A6A7A', fontSize: 16, lineHeight: 1.6, maxWidth: 480, margin: '16px auto 0' }}>
            A curated pathway from aspiration to governance excellence.
          </p>
        </motion.div>

        {/* Desktop timeline */}
        <div className="hidden md:block relative">
          {/* Connecting line */}
          <div className="absolute top-[52px] left-[12.5%] right-[12.5%] h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(249,159,27,0.3), rgba(249,159,27,0.3), transparent)' }} />

          {/* Animated line overlay */}
          <motion.div
            className="absolute top-[52px] h-[1px]"
            initial={{ width: 0, left: '12.5%' }}
            animate={inView ? { width: '75%' } : {}}
            transition={{ duration: 1.5, delay: 0.4, ease: 'easeInOut' }}
            style={{ background: 'linear-gradient(90deg, #F99F1B, #FFD36A)' }}
          />

          <div className="grid grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.3 + i * 0.15 }}
                className="flex flex-col items-center text-center group"
              >
                {/* Node */}
                <div className="relative mb-8">
                  <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 }}
                    className="absolute inset-0 rounded-full"
                    style={{ background: `radial-gradient(circle, ${step.color}, transparent)`, transform: 'scale(1.8)' }}
                  />
                  <div
                    className="relative z-10 w-[52px] h-[52px] rounded-full flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, #F99F1B, #FFD36A)',
                      boxShadow: `0 0 24px rgba(249,159,27,0.4)`,
                    }}
                  >
                    <step.icon size={22} color="#0A0A0A" />
                  </div>
                </div>

                {/* Card */}
                <div
                  className="w-full p-6 rounded-2xl"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(16px)',
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(249,159,27,0.06)';
                    e.currentTarget.style.borderColor = 'rgba(249,159,27,0.25)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#F99F1B', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>
                    Step {step.number}
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 500, color: '#F5F0E8', lineHeight: 1.1, marginBottom: 4 }}>{step.title}</h3>
                  <div style={{ fontSize: 12, color: '#F99F1B', marginBottom: 12 }}>{step.subtitle}</div>
                  <p style={{ color: '#6A6A7A', fontSize: 13, lineHeight: 1.6 }}>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile timeline */}
        <div className="md:hidden flex flex-col gap-6 relative">
          <div className="absolute left-6 top-0 bottom-0 w-[1px]" style={{ background: 'linear-gradient(180deg, #F99F1B, transparent)' }} />
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
              className="flex gap-6 pl-4"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#F99F1B,#FFD36A)' }}>
                <step.icon size={14} color="#0A0A0A" />
              </div>
              <div className="flex-1 pb-2">
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#F99F1B', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Step {step.number}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 500, color: '#F5F0E8', marginBottom: 6 }}>{step.title}</h3>
                <p style={{ color: '#6A6A7A', fontSize: 13, lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
