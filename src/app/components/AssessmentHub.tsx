import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { assessments as assessmentsStore, analytics } from "../utils/store";

export function AssessmentHub() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [assessments, setAssessments] = useState(() => assessmentsStore.getActive());

  useEffect(() => {
    const data = assessmentsStore.getActive();
    if (data.length) setAssessments(data);
  }, []);

  const handleAssessmentClick = (url: string) => {
    analytics.track('assessment');
    if (url && url !== '#') window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      id="assessments"
      ref={ref}
      style={{
        background: 'linear-gradient(180deg, #0A0A0A 0%, #0F172A 40%, #0A0A0A 100%)',
        padding: '120px 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(249,159,27,0.04) 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full" style={{ background: 'rgba(249,159,27,0.08)', border: '1px solid rgba(249,159,27,0.2)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#F99F1B', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Signature Feature</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4.5vw,3.5rem)', fontWeight: 600, color: '#F5F0E8', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
            The Assessment <em style={{ color: '#F99F1B' }}>Hub</em>
          </h2>
          <p style={{ color: '#6A6A7A', fontSize: 16, lineHeight: 1.6, maxWidth: 520, margin: '16px auto 0' }}>
            Structured, science-backed assessments to measure and elevate governance capability.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {assessments.map((assessment, i) => (
            <motion.div
              key={assessment.id}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15 + i * 0.1 }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative rounded-2xl p-8 overflow-hidden"
              style={{
                background: hoveredIndex === i ? 'rgba(249,159,27,0.06)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${hoveredIndex === i ? 'rgba(249,159,27,0.3)' : 'rgba(255,255,255,0.08)'}`,
                backdropFilter: 'blur(20px)',
                boxShadow: hoveredIndex === i ? '0 20px 60px rgba(249,159,27,0.12), inset 0 1px 0 rgba(249,159,27,0.1)' : '0 8px 32px rgba(0,0,0,0.2)',
                transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
                cursor: 'none',
                transform: hoveredIndex === i ? 'translateY(-4px)' : 'translateY(0)',
              }}
            >
              {/* Glow top-left */}
              <div
                className="absolute top-0 left-0 w-40 h-40 rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(249,159,27,0.15), transparent)',
                  transform: 'translate(-30%, -30%)',
                  opacity: hoveredIndex === i ? 1 : 0,
                  transition: 'opacity 0.4s',
                }}
              />

              <div className="relative z-10">
                {/* Icon */}
                <div className="flex items-start justify-between mb-6">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{
                      background: hoveredIndex === i ? '#F99F1B' : 'rgba(249,159,27,0.1)',
                      border: '1px solid rgba(249,159,27,0.2)',
                      transition: 'all 0.4s',
                      boxShadow: hoveredIndex === i ? '0 0 24px rgba(249,159,27,0.4)' : 'none',
                      fontSize: 24,
                    }}
                  >
                    {assessment.icon}
                  </div>
                  <motion.div
                    animate={{ rotate: hoveredIndex === i ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ArrowUpRight size={18} color={hoveredIndex === i ? '#F99F1B' : '#3A3A4A'} />
                  </motion.div>
                </div>

                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 500, color: '#F5F0E8', lineHeight: 1.2, marginBottom: 10 }}>
                  {assessment.name}
                </h3>
                <p style={{ color: '#6A6A7A', fontSize: 13, lineHeight: 1.6, marginBottom: 24 }}>
                  {assessment.description}
                </p>

                {/* CTA */}
                <div className="flex justify-end">
                  <button
                    onClick={() => handleAssessmentClick(assessment.url)}
                    style={{
                      background: hoveredIndex === i ? '#F99F1B' : 'transparent',
                      color: hoveredIndex === i ? '#0A0A0A' : '#F99F1B',
                      fontSize: 12,
                      fontWeight: 600,
                      padding: '7px 14px',
                      borderRadius: 7,
                      border: `1px solid ${hoveredIndex === i ? 'transparent' : 'rgba(249,159,27,0.3)'}`,
                      cursor: 'none',
                      transition: 'all 0.3s',
                    }}
                  >
                    {assessment.buttonText}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
