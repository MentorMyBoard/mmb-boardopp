import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, ChevronDown } from "lucide-react";

const floatingCards = [
  { icon: "🏛", label: "Board Placement", value: "1,200+ Roles", delay: 0 },
  { icon: "⚖", label: "Governance Experts", value: "2,000+ Professionals", delay: 0.3 },
  { icon: "📊", label: "Organizations", value: "500+ Companies", delay: 0.6 },
  { icon: "🌿", label: "ESG Specialists", value: "340+ Advisors", delay: 0.9 },
];

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    type Particle = { x: number; y: number; vx: number; vy: number; r: number; opacity: number };
    const particles: Particle[] = [];
    for (let i = 0; i < 90; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const alpha = (1 - dist / 160) * 0.25;
            ctx.strokeStyle = `rgba(249,159,27,${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Mouse connection
      particles.forEach((p) => {
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mx, my);
          const alpha = (1 - dist / 200) * 0.4;
          ctx.strokeStyle = `rgba(249,159,27,${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      });

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(249,159,27,${p.opacity})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative overflow-hidden"
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse 90% 60% at 50% -5%, rgba(25,25,112,0.6) 0%, rgba(25,25,112,0.15) 50%, #08081C 80%)',
      }}
    >
      {/* Canvas background */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ opacity: 0.7 }} />

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(249,159,27,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 pt-24 pb-16 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex items-center gap-2 mb-10 px-4 py-2 rounded-full"
          style={{
            background: 'rgba(249,159,27,0.08)',
            border: '1px solid rgba(249,159,27,0.25)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#F99F1B', boxShadow: '0 0 6px #F99F1B' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#F99F1B', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            An Initiative by MentorMyBoard
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.2rem, 5vw, 5rem)',
            fontWeight: 600,
            lineHeight: 1.1,
            color: '#F5F0E8',
            maxWidth: 900,
            letterSpacing: '-0.02em',
          }}
        >
          The Future of
          <br />
          <span style={{ color: '#F99F1B', whiteSpace: 'nowrap' }}>Board Opportunities</span>
          <br />Starts Here.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          style={{
            color: '#8A8A9A',
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            lineHeight: 1.65,
            maxWidth: 620,
            marginTop: 24,
          }}
        >
          Connecting visionary organizations with governance leaders while helping professionals
          prepare for meaningful boardroom roles.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.72 }}
          className="flex flex-wrap items-center justify-center gap-4 mt-10"
        >
          <button
            style={{
              background: '#F99F1B',
              color: '#0A0A0A',
              fontSize: 14,
              fontWeight: 600,
              padding: '14px 28px',
              borderRadius: 10,
              border: 'none',
              boxShadow: '0 0 30px rgba(249,159,27,0.35)',
              cursor: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'box-shadow 0.2s, transform 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 50px rgba(249,159,27,0.55)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 30px rgba(249,159,27,0.35)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Post a Board Requirement <ArrowRight size={15} />
          </button>
          <button
            style={{
              background: 'rgba(255,255,255,0.05)',
              color: '#F5F0E8',
              fontSize: 14,
              fontWeight: 500,
              padding: '14px 28px',
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.12)',
              backdropFilter: 'blur(10px)',
              cursor: 'none',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(249,159,27,0.4)';
              e.currentTarget.style.background = 'rgba(249,159,27,0.06)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            }}
          >
            Explore Opportunities
          </button>
          <button
            style={{
              background: 'transparent',
              color: '#F99F1B',
              fontSize: 14,
              fontWeight: 500,
              padding: '14px 28px',
              borderRadius: 10,
              border: '1px solid rgba(249,159,27,0.3)',
              cursor: 'none',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#F99F1B';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(249,159,27,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(249,159,27,0.3)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Take an Assessment
          </button>
        </motion.div>

        {/* Floating stat cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="flex flex-wrap items-center justify-center gap-4 mt-16"
        >
          {floatingCards.map((card, i) => (
            <motion.div
              key={card.label}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3.5 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: card.delay }}
              className="flex items-center gap-3 px-5 py-3 rounded-xl"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.09)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = 'rgba(249,159,27,0.3)';
                el.style.boxShadow = '0 8px 40px rgba(249,159,27,0.15)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = 'rgba(255,255,255,0.09)';
                el.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
              }}
            >
              <span style={{ fontSize: 18 }}>{card.icon}</span>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', color: '#F99F1B', fontSize: 12, fontWeight: 500 }}>{card.value}</div>
                <div style={{ color: '#7A7A8A', fontSize: 11 }}>{card.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#5A5A6A', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Scroll</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ChevronDown size={16} color="#5A5A6A" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
