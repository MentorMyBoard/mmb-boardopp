import { useRef, useEffect } from "react";
import { motion, useInView } from "motion/react";
import { ArrowRight } from "lucide-react";

export function FinalCTA() {
  const ref = useRef(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    window.addEventListener('mousemove', onMove);

    type P = { x: number; y: number; vx: number; vy: number; r: number };
    const particles: P[] = [];
    for (let i = 0; i < 50; i++) {
      particles.push({ x: Math.random() * 1400, y: Math.random() * 500, vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25, r: Math.random() * 1.5 + 0.5 });
    }

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mx = mouseRef.current.x, my = mouseRef.current.y;

      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        const dx = p.x - mx, dy = p.y - my;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 180) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mx, my);
          ctx.strokeStyle = `rgba(249,159,27,${(1 - d / 180) * 0.3})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(249,159,27,0.4)';
        ctx.fill();
      });
      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); window.removeEventListener('mousemove', onMove); };
  }, []);

  return (
    <section
      ref={ref}
      id="cta"
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0A0A0A 0%, #0F172A 50%, #0A0A0A 100%)',
        padding: '140px 0',
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(249,159,27,0.07) 0%, transparent 70%)' }} />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2 mb-8 px-3 py-1.5 rounded-full" style={{ background: 'rgba(249,159,27,0.08)', border: '1px solid rgba(249,159,27,0.2)' }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#F99F1B', boxShadow: '0 0 6px #F99F1B' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#F99F1B', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Your Journey Begins Here</span>
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem,5vw,4.2rem)',
              fontWeight: 400,
              color: '#F5F0E8',
              lineHeight: 1.12,
              letterSpacing: '-0.025em',
              marginBottom: 24,
            }}
          >
            Whether You Are{' '}
            <em style={{ fontStyle: 'italic', color: '#F99F1B' }}>Building a Board</em>
            <br />
            or <em style={{ fontStyle: 'italic', color: '#F99F1B' }}>Joining One</em>,
            <br />
            Your Journey Begins Here.
          </h2>

          <p style={{ color: '#6A6A7A', fontSize: 17, lineHeight: 1.65, maxWidth: 520, margin: '0 auto 48px' }}>
            Join a governance ecosystem that is redefining how India's boardrooms are built, measured, and strengthened.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              style={{
                background: 'linear-gradient(135deg, #F99F1B, #FFD36A)',
                color: '#0A0A0A',
                fontSize: 14,
                fontWeight: 700,
                padding: '16px 32px',
                borderRadius: 12,
                border: 'none',
                cursor: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 0 40px rgba(249,159,27,0.4)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 60px rgba(249,159,27,0.6)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 0 40px rgba(249,159,27,0.4)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Post a Requirement <ArrowRight size={16} />
            </button>
            <button
              style={{
                background: 'rgba(255,255,255,0.05)',
                color: '#F5F0E8',
                fontSize: 14,
                fontWeight: 500,
                padding: '16px 32px',
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.12)',
                backdropFilter: 'blur(10px)',
                cursor: 'none',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(249,159,27,0.4)'; e.currentTarget.style.background = 'rgba(249,159,27,0.07)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
            >
              Explore Opportunities
            </button>
            <button
              style={{
                background: 'transparent',
                color: '#F99F1B',
                fontSize: 14,
                fontWeight: 500,
                padding: '16px 32px',
                borderRadius: 12,
                border: '1px solid rgba(249,159,27,0.3)',
                cursor: 'none',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#F99F1B'; e.currentTarget.style.boxShadow = '0 0 20px rgba(249,159,27,0.15)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(249,159,27,0.3)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              Take an Assessment
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
