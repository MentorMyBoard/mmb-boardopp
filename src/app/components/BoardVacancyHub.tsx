import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { UserCircle, Building2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";

const cards = [
  {
    forLabel: "For Directors & Leaders",
    headline: "Find Board Opportunities",
    description: "Register your profile and become visible for future Independent Director, Advisory Board, Committee Member and Governance opportunities.",
    cta: "Join the Boardroom",
    href: "/join",
    icon: UserCircle,
    accent: "#F99F1B",
    gradient: "linear-gradient(135deg, rgba(249,159,27,0.12) 0%, rgba(249,159,27,0.03) 100%)",
    glowColor: "rgba(249,159,27,0.2)",
    tag: "Directors & Leaders",
  },
  {
    forLabel: "For Companies & Organizations",
    headline: "Post a Board Requirement",
    description: "Tell us about your board, advisory, governance or leadership requirements and connect with the right governance ecosystem.",
    cta: "Post Requirement",
    href: "/post-requirement",
    icon: Building2,
    accent: "#8890FF",
    gradient: "linear-gradient(135deg, rgba(136,144,255,0.1) 0%, rgba(136,144,255,0.02) 100%)",
    glowColor: "rgba(136,144,255,0.2)",
    tag: "Companies & Organizations",
  },
];

export function BoardVacancyHub() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState<Record<number, { x: number; y: number }>>({});

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, idx: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos((prev) => ({
      ...prev,
      [idx]: { x: e.clientX - rect.left, y: e.clientY - rect.top },
    }));
  };

  return (
    <section id="vacancy" ref={ref} style={{ background: '#0A0A0A', padding: '120px 0', position: 'relative', overflow: 'hidden' }}>
      {/* Background ambience */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(249,159,27,0.04) 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full" style={{ background: 'rgba(249,159,27,0.08)', border: '1px solid rgba(249,159,27,0.2)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#F99F1B', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Board Vacancy Hub</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4.5vw,3.5rem)', fontWeight: 400, color: '#F5F0E8', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
            Board Opportunities{' '}
            <em style={{ fontStyle: 'italic', color: '#F99F1B' }}>Begin Here</em>
          </h2>
          <p style={{ color: '#6A6A7A', fontSize: 16, lineHeight: 1.6, maxWidth: 520, margin: '16px auto 0' }}>
            Whether you are looking for board opportunities or seeking board talent, start by registering your interest.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {cards.map((card, i) => {
            const mp = mousePos[i];
            const Icon = card.icon;
            return (
              <motion.div
                key={card.headline}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.15 + i * 0.15 }}
                className="group relative rounded-3xl overflow-hidden"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(20px)',
                  padding: '48px 40px',
                  cursor: 'none',
                  transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s, border-color 0.35s',
                }}
                onMouseMove={(e) => handleMouseMove(e, i)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.borderColor = `${card.accent}40`;
                  e.currentTarget.style.boxShadow = `0 32px 80px ${card.glowColor}, 0 0 0 1px ${card.accent}20`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.boxShadow = 'none';
                  setMousePos((prev) => { const next = { ...prev }; delete next[i]; return next; });
                }}
              >
                {/* Mouse tracking glow */}
                {mp && (
                  <div
                    className="absolute pointer-events-none rounded-full"
                    style={{
                      width: 300,
                      height: 300,
                      background: `radial-gradient(circle, ${card.glowColor} 0%, transparent 70%)`,
                      left: mp.x - 150,
                      top: mp.y - 150,
                      transition: 'opacity 0.2s',
                      opacity: 0.6,
                    }}
                  />
                )}

                {/* Animated border glow */}
                <div
                  className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100"
                  style={{
                    background: card.gradient,
                    transition: 'opacity 0.4s',
                  }}
                />

                {/* Content */}
                <div className="relative z-10">
                  {/* Tag */}
                  <div className="inline-flex items-center gap-2 mb-8 px-3 py-1.5 rounded-full" style={{ background: `${card.accent}15`, border: `1px solid ${card.accent}30` }}>
                    <Icon size={12} color={card.accent} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: card.accent, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{card.forLabel}</span>
                  </div>

                  {/* Icon */}
                  <div
                    className="mb-7"
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 16,
                      background: `${card.accent}15`,
                      border: `1px solid ${card.accent}30`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s',
                    }}
                  >
                    <Icon size={28} color={card.accent} />
                  </div>

                  {/* Headline */}
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 400, color: '#F5F0E8', lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 16 }}>
                    {card.headline}
                  </h3>

                  {/* Description */}
                  <p style={{ color: '#7A7A8A', fontSize: 15, lineHeight: 1.7, marginBottom: 36 }}>
                    {card.description}
                  </p>

                  {/* CTA */}
                  <button
                    onClick={() => navigate(card.href)}
                    className="flex items-center gap-3 group/btn"
                    style={{
                      background: i === 0 ? 'linear-gradient(135deg, #F99F1B, #FFD36A)' : 'transparent',
                      color: i === 0 ? '#0A0A0A' : card.accent,
                      fontSize: 14,
                      fontWeight: 600,
                      padding: '13px 24px',
                      borderRadius: 10,
                      border: i === 0 ? 'none' : `1px solid ${card.accent}40`,
                      boxShadow: i === 0 ? '0 0 24px rgba(249,159,27,0.3)' : 'none',
                      cursor: 'none',
                      transition: 'all 0.25s',
                    }}
                    onMouseEnter={(e) => {
                      if (i === 0) { e.currentTarget.style.boxShadow = '0 0 40px rgba(249,159,27,0.5)'; e.currentTarget.style.transform = 'translateX(3px)'; }
                      else { e.currentTarget.style.background = `${card.accent}15`; e.currentTarget.style.borderColor = `${card.accent}70`; e.currentTarget.style.transform = 'translateX(3px)'; }
                    }}
                    onMouseLeave={(e) => {
                      if (i === 0) { e.currentTarget.style.boxShadow = '0 0 24px rgba(249,159,27,0.3)'; e.currentTarget.style.transform = 'translateX(0)'; }
                      else { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = `${card.accent}40`; e.currentTarget.style.transform = 'translateX(0)'; }
                    }}
                  >
                    {card.cta}
                    <ArrowRight size={15} style={{ transition: 'transform 0.2s' }} className="group-hover/btn:translate-x-1" />
                  </button>
                </div>

                {/* Corner decoration */}
                <div
                  className="absolute bottom-0 right-0 w-48 h-48 pointer-events-none opacity-30 group-hover:opacity-60"
                  style={{
                    background: `radial-gradient(circle at bottom right, ${card.accent}20 0%, transparent 70%)`,
                    transition: 'opacity 0.4s',
                  }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
