import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { testimonials as testimonialsStore } from "../utils/store";

export function Testimonials() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [current, setCurrent] = useState(0);
  const [testimonials, setTestimonials] = useState(testimonialsStore.getActive().map((t) => ({
    name: t.name, role: t.designation, company: t.organization, quote: t.text, img: t.photo,
  })));

  useEffect(() => {
    const data = testimonialsStore.getActive().map((t) => ({
      name: t.name, role: t.designation, company: t.organization, quote: t.text, img: t.photo,
    }));
    if (data.length) setTestimonials(data);
  }, []);

  useEffect(() => {
    if (!testimonials.length) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + Math.max(testimonials.length, 1)) % Math.max(testimonials.length, 1));
  const next = () => setCurrent((c) => (c + 1) % Math.max(testimonials.length, 1));

  if (!testimonials.length) return null;

  return (
    <section
      id="testimonials"
      ref={ref}
      style={{
        background: '#08081C',
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
          <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full" style={{ background: 'rgba(249,159,27,0.08)', border: '1px solid rgba(249,159,27,0.2)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#F99F1B', letterSpacing: '0.12em', textTransform: 'uppercase' }}>What they say</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4.5vw,3.5rem)', fontWeight: 600, color: '#F5F0E8', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
            Voices from the <em style={{ color: '#F99F1B' }}>Boardroom</em>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative max-w-3xl mx-auto"
        >
          {/* Card */}
          <div
            className="relative rounded-3xl p-10 md:p-14"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
              minHeight: 280,
            }}
          >
            {/* Gold quote mark */}
            <div className="absolute top-8 left-10 opacity-20">
              <Quote size={48} color="#F99F1B" />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.1rem,2.2vw,1.35rem)',
                    color: '#E8E3D8',
                    lineHeight: 1.65,
                    marginBottom: 32,
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  "{testimonials[current].quote}"
                </p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonials[current].img}
                    alt={testimonials[current].name}
                    className="w-12 h-12 rounded-full object-cover"
                    style={{ border: '2px solid rgba(249,159,27,0.3)' }}
                  />
                  <div>
                    <div style={{ color: '#F5F0E8', fontSize: 15, fontWeight: 600 }}>{testimonials[current].name}</div>
                    <div style={{ color: '#F99F1B', fontSize: 12 }}>{testimonials[current].role}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#5A5A6A' }}>{testimonials[current].company}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#9B9BAB',
                cursor: 'none',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(249,159,27,0.4)'; e.currentTarget.style.color = '#F99F1B'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#9B9BAB'; }}
            >
              <ChevronLeft size={16} />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  style={{
                    width: i === current ? 24 : 6,
                    height: 6,
                    borderRadius: 3,
                    background: i === current ? '#F99F1B' : 'rgba(255,255,255,0.15)',
                    border: 'none',
                    cursor: 'none',
                    transition: 'all 0.3s',
                  }}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#9B9BAB',
                cursor: 'none',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(249,159,27,0.4)'; e.currentTarget.style.color = '#F99F1B'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#9B9BAB'; }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
