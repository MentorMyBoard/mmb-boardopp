import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "motion/react";
import { partners as partnersStore } from "../utils/store";
import type { Partner } from "../utils/store";

// Fallback logo placeholder
function PartnerLogo({ partner }: { partner: Partner }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="flex-shrink-0 flex items-center justify-center rounded-2xl"
      style={{
        width: 160,
        height: 80,
        background: hovered ? 'rgba(249,159,27,0.06)' : 'rgba(255,255,255,0.6)',
        backdropFilter: 'blur(12px)',
        border: hovered ? '1px solid rgba(249,159,27,0.3)' : '1px solid rgba(0,0,0,0.06)',
        boxShadow: hovered ? '0 8px 32px rgba(249,159,27,0.15), 0 4px 16px rgba(0,0,0,0.06)' : '0 2px 12px rgba(0,0,0,0.06)',
        cursor: 'none',
        transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
        transform: hovered ? 'translateY(-3px) scale(1.03)' : 'translateY(0) scale(1)',
        padding: '12px 20px',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => partner.website && partner.website !== '#' && window.open(partner.website, '_blank')}
    >
      {partner.logo ? (
        <img
          src={partner.logo}
          alt={partner.name}
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', filter: hovered ? 'none' : 'grayscale(30%)' }}
        />
      ) : (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: hovered ? '#F99F1B' : '#1A1A2A', letterSpacing: '-0.01em', transition: 'color 0.3s' }}>
            {partner.name}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: hovered ? 'rgba(249,159,27,0.6)' : '#9B9BAB', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 2 }}>
            Partner
          </div>
        </div>
      )}
    </motion.div>
  );
}

export function OurPartners() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [partnerList, setPartnerList] = useState<Partner[]>([]);
  const [paused, setPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const animRef = useRef<number>(0);

  useEffect(() => {
    setPartnerList(partnersStore.getActive());
  }, []);

  // Infinite marquee animation
  useEffect(() => {
    if (!partnerList.length || !trackRef.current) return;
    const speed = 0.5;
    const track = trackRef.current;

    const animate = () => {
      if (!paused) {
        posRef.current -= speed;
        const halfWidth = track.scrollWidth / 2;
        if (Math.abs(posRef.current) >= halfWidth) {
          posRef.current = 0;
        }
        track.style.transform = `translateX(${posRef.current}px)`;
      }
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [partnerList, paused]);

  const doubled = [...partnerList, ...partnerList, ...partnerList];

  return (
    <section
      id="partners"
      ref={ref}
      style={{
        background: 'linear-gradient(180deg, #FAFAF8 0%, #F5F2EA 100%)',
        padding: '120px 0',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Subtle gradient blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(249,159,27,0.06) 0%, transparent 70%)', transform: 'translate(-40%, -40%)' }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(249,159,27,0.04) 0%, transparent 70%)', transform: 'translate(40%, 40%)' }} />

      <div className="max-w-7xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full" style={{ background: 'rgba(249,159,27,0.1)', border: '1px solid rgba(249,159,27,0.25)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#C47E0F', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Governance Network</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4.5vw,3.5rem)', fontWeight: 600, color: '#1A1A2A', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
            Our{' '}
            <em style={{ color: '#F99F1B' }}>Partners</em>
          </h2>
          <p style={{ color: '#5A5A6A', fontSize: 16, lineHeight: 1.6, maxWidth: 480, margin: '16px auto 0' }}>
            Collaborating with India's leading institutions, knowledge bodies, and governance organizations to build a stronger boardroom ecosystem.
          </p>
        </motion.div>

        {/* Partner types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-14"
        >
          {['Institutional Partners', 'Knowledge Partners', 'Governance Partners', 'Industry Bodies'].map((type) => (
            <span
              key={type}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: '#6A6A7A',
                background: 'rgba(255,255,255,0.8)',
                border: '1px solid rgba(0,0,0,0.08)',
                padding: '6px 14px',
                borderRadius: 20,
                backdropFilter: 'blur(8px)',
              }}
            >
              {type}
            </span>
          ))}
        </motion.div>

        {/* Marquee */}
        {partnerList.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, #FAFAF8, transparent)' }} />
            <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, #F5F2EA, transparent)' }} />

            <div style={{ overflow: 'hidden' }}>
              <div ref={trackRef} className="flex gap-5 items-center" style={{ width: 'max-content' }}>
                {doubled.map((partner, i) => (
                  <PartnerLogo key={`${partner.id}-${i}`} partner={partner} />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Partner types caption */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-14"
        >
          <p style={{ color: '#9B9BAB', fontSize: 13, fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>
            Hover to pause · Click to visit partner
          </p>
        </motion.div>
      </div>
    </section>
  );
}
