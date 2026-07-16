import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || '';

interface Popup {
  id: string;
  title: string;
  image_url: string;
  orientation: 'portrait' | 'landscape';
  image_width: number;
  image_height: number;
  button_text: string;
  button_url: string;
  position: 'left-top' | 'left-bottom' | 'right-top' | 'right-bottom' | 'center-top' | 'center-bottom';
  is_active: number;
}


function positionStyle(pos: Popup['position']): React.CSSProperties {
  const base: React.CSSProperties = { position: 'fixed', zIndex: 8500 };
  switch (pos) {
    case 'left-top':      return { ...base, left: 20, top: 88 };
    case 'left-bottom':   return { ...base, left: 20, bottom: 24 };
    case 'right-top':     return { ...base, right: 20, top: 88 };
    case 'right-bottom':  return { ...base, right: 20, bottom: 24 };
    case 'center-top':    return { ...base, left: '50%', top: 88,    transform: 'translateX(-50%)' };
    case 'center-bottom': return { ...base, left: '50%', bottom: 24, transform: 'translateX(-50%)' };
    default:              return { ...base, right: 20, bottom: 24 };
  }
}

function slideVariants(pos: Popup['position']) {
  if (pos.startsWith('left'))   return { hidden: { x: -80, opacity: 0 }, visible: { x: 0, opacity: 1 }, exit: { x: -80, opacity: 0 } };
  if (pos.startsWith('right'))  return { hidden: { x: 80,  opacity: 0 }, visible: { x: 0, opacity: 1 }, exit: { x: 80,  opacity: 0 } };
  if (pos.endsWith('top'))      return { hidden: { y: -60, opacity: 0 }, visible: { y: 0, opacity: 1 }, exit: { y: -60, opacity: 0 } };
  return                               { hidden: { y: 60,  opacity: 0 }, visible: { y: 0, opacity: 1 }, exit: { y: 60,  opacity: 0 } };
}

function SinglePopup({ popup, onDismiss }: { popup: Popup; onDismiss: () => void }) {
  const vars = slideVariants(popup.position);

  return (
    <motion.div
      key={popup.id}
      variants={vars}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ type: 'spring', stiffness: 300, damping: 28, delay: 0.3 }}
      style={{
        ...positionStyle(popup.position),
        borderRadius: 14,
        overflow: 'hidden',
        boxShadow: '0 16px 56px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.08)',
        background: '#fff',
        width: popup.image_width,
        maxWidth: 'calc(100vw - 40px)',
      }}
    >
      {/* Close button */}
      <button
        onClick={onDismiss}
        aria-label="Close"
        style={{
          position: 'absolute', top: 8, right: 8, zIndex: 10,
          width: 28, height: 28, borderRadius: '50%',
          background: 'rgba(0,0,0,0.55)', border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'background 0.15s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.8)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.55)'; }}
      >
        <X size={14} color="#fff" />
      </button>

      {/* Image */}
      <img
        src={popup.image_url}
        alt={popup.title}
        style={{
          display: 'block',
          width: '100%',
          height: popup.image_height,
          objectFit: 'cover',
        }}
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
      />

      {/* CTA Button */}
      {popup.button_text && popup.button_url && (
        <div style={{ padding: '12px 16px', background: '#fff' }}>
          <a
            href={popup.button_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block', width: '100%', textAlign: 'center',
              background: '#F99F1B', color: '#0A0A0A',
              fontWeight: 700, fontSize: 13, padding: '10px 16px',
              borderRadius: 8, textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(249,159,27,0.35)',
              transition: 'box-shadow 0.2s, background 0.2s',
            }}
            onMouseEnter={(e) => { (e.target as HTMLAnchorElement).style.boxShadow = '0 6px 24px rgba(249,159,27,0.55)'; }}
            onMouseLeave={(e) => { (e.target as HTMLAnchorElement).style.boxShadow = '0 4px 16px rgba(249,159,27,0.35)'; }}
          >
            {popup.button_text}
          </a>
        </div>
      )}
    </motion.div>
  );
}

export function PromoPopups() {
  const [popups, setPopups] = useState<Popup[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch(`${API_BASE}/api/popups`)
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setPopups(data); })
      .catch(() => {});
  }, []);

  const handleDismiss = (id: string) => {
    setDismissed((prev) => new Set([...prev, id]));
  };

  const visible = popups.filter((p) => !dismissed.has(p.id));

  return (
    <AnimatePresence>
      {visible.map((popup) => (
        <SinglePopup key={popup.id} popup={popup} onDismiss={() => handleDismiss(popup.id)} />
      ))}
    </AnimatePresence>
  );
}
