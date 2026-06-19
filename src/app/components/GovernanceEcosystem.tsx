import { useRef } from "react";
import { motion, useInView } from "motion/react";

const nodes = [
  { id: 'companies', label: 'Companies', angle: 0 },
  { id: 'directors', label: 'Independent Directors', angle: 45 },
  { id: 'advisory', label: 'Advisory Boards', angle: 90 },
  { id: 'esg', label: 'ESG Experts', angle: 135 },
  { id: 'governance', label: 'Governance Professionals', angle: 180 },
  { id: 'mentormyboard', label: 'MentorMyBoard Programs', angle: 225 },
  { id: 'evaluation', label: 'Board Evaluations', angle: 270 },
  { id: 'leadership', label: 'Leadership Development', angle: 315 },
];

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

const CX = 400, CY = 300, R = 210;

export function GovernanceEcosystem() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="ecosystem"
      ref={ref}
      style={{
        background: 'linear-gradient(180deg, #F5F2EA 0%, #EEE9DF 100%)',
        padding: '120px 0',
        overflow: 'hidden',
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full" style={{ background: 'rgba(249,159,27,0.1)', border: '1px solid rgba(249,159,27,0.25)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#C47E0F', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Connected governance</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4.5vw,3.5rem)', fontWeight: 600, color: '#1A1A2A', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
            The Governance <em style={{ color: '#F99F1B' }}>Ecosystem</em>
          </h2>
          <p style={{ color: '#5A5A6A', fontSize: 16, lineHeight: 1.6, maxWidth: 500, margin: '16px auto 0' }}>
            BoardOpp sits at the center of a vibrant network connecting all governance stakeholders.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center"
        >
          <svg viewBox="0 0 800 600" className="w-full max-w-3xl" style={{ overflow: 'visible' }}>
            <defs>
              <radialGradient id="centralGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#F99F1B" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#F99F1B" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#F99F1B" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#F99F1B" stopOpacity="0" />
              </radialGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Outer orbit rings */}
            <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(249,159,27,0.08)" strokeWidth="1" strokeDasharray="4 8" />
            <circle cx={CX} cy={CY} r={R * 0.55} fill="none" stroke="rgba(249,159,27,0.05)" strokeWidth="1" strokeDasharray="4 8" />

            {/* Connection lines */}
            {nodes.map((node, i) => {
              const pos = polar(CX, CY, R, node.angle);
              return (
                <motion.line
                  key={node.id}
                  x1={CX}
                  y1={CY}
                  x2={pos.x}
                  y2={pos.y}
                  stroke="rgba(249,159,27,0.25)"
                  strokeWidth="1"
                  strokeDasharray="4 6"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={inView ? { pathLength: 1, opacity: 1 } : {}}
                  transition={{ duration: 0.8, delay: 0.5 + i * 0.08 }}
                />
              );
            })}

            {/* Central glow */}
            <motion.circle
              cx={CX} cy={CY} r={80}
              fill="url(#centralGlow)"
              animate={{ r: [75, 88, 75] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Central node */}
            <motion.circle
              cx={CX} cy={CY} r={52}
              fill="none"
              stroke="rgba(249,159,27,0.3)"
              strokeWidth="1"
              animate={{ r: [52, 58, 52] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            <circle cx={CX} cy={CY} r={44} fill="rgba(250,250,248,0.95)" stroke="#F99F1B" strokeWidth="1.5" filter="url(#glow)" />
            <text
              x={CX} y={CY - 6}
              textAnchor="middle"
              fill="#F99F1B"
              style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600 }}
            >
              BOARD
            </text>
            <text
              x={CX} y={CY + 10}
              textAnchor="middle"
              fill="#F99F1B"
              style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600 }}
            >
              OPP
            </text>
            <text
              x={CX} y={CY + 24}
              textAnchor="middle"
              fill="rgba(249,159,27,0.5)"
              style={{ fontFamily: 'var(--font-mono)', fontSize: 7 }}
            >
              by MentorMyBoard
            </text>

            {/* Outer nodes */}
            {nodes.map((node, i) => {
              const pos = polar(CX, CY, R, node.angle);
              const labelPos = polar(CX, CY, R + 42, node.angle);
              const isRight = pos.x > CX + 20;
              const isLeft = pos.x < CX - 20;

              return (
                <motion.g
                  key={node.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
                >
                  {/* Glow */}
                  <circle cx={pos.x} cy={pos.y} r={24} fill="url(#nodeGlow)" />
                  {/* Node */}
                  <circle
                    cx={pos.x} cy={pos.y} r={16}
                    fill="rgba(250,250,248,0.95)"
                    stroke="rgba(249,159,27,0.4)"
                    strokeWidth="1.5"
                    filter="url(#glow)"
                  />
                  <motion.circle
                    cx={pos.x} cy={pos.y} r={16}
                    fill="none"
                    stroke="rgba(249,159,27,0.2)"
                    strokeWidth="1"
                    animate={{ r: [16, 22, 16] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
                  />
                  <circle cx={pos.x} cy={pos.y} r={4} fill="#F99F1B" />

                  {/* Label */}
                  <text
                    x={labelPos.x}
                    y={labelPos.y}
                    textAnchor={isRight ? 'start' : isLeft ? 'end' : 'middle'}
                    dominantBaseline="middle"
                    fill="#4A4A5A"
                    style={{ fontFamily: 'var(--font-body)', fontSize: 10.5 }}
                  >
                    {node.label}
                  </text>
                </motion.g>
              );
            })}
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
