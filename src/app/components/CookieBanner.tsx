import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Cookie, X, Check } from "lucide-react";

const COOKIE_KEY = "bo_cookie_consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) {
      // Small delay so it doesn't flash immediately on load
      const t = setTimeout(() => setVisible(true), 1800);
      return () => clearTimeout(t);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(COOKIE_KEY, "declined");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            width: "calc(100% - 48px)",
            maxWidth: 640,
            background: "rgba(20, 20, 22, 0.96)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(249,159,27,0.25)",
            borderRadius: 16,
            padding: "20px 24px",
            boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
          }}
          role="dialog"
          aria-label="Cookie consent"
        >
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            {/* Icon */}
            <div
              style={{
                flexShrink: 0,
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "rgba(249,159,27,0.12)",
                border: "1px solid rgba(249,159,27,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Cookie size={17} color="#F99F1B" />
            </div>

            {/* Text */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  color: "#F5F0E8",
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: 4,
                  lineHeight: 1.3,
                }}
              >
                We use cookies to improve your experience
              </div>
              <p style={{ color: "#6A6A7A", fontSize: 12, lineHeight: 1.6, margin: 0 }}>
                BoardOpp uses cookies for site functionality and analytics. By accepting, you agree to our{" "}
                <a
                  href="https://mentormyboard.com/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#F99F1B", textDecoration: "none" }}
                >
                  Privacy Policy
                </a>
                .
              </p>
            </div>

            {/* Dismiss */}
            <button
              onClick={decline}
              style={{
                flexShrink: 0,
                background: "none",
                border: "none",
                color: "#4A4A5A",
                cursor: "pointer",
                padding: 4,
                lineHeight: 1,
              }}
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </div>

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 16,
              paddingLeft: 52,
            }}
          >
            <button
              onClick={accept}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "#F99F1B",
                color: "#0A0A0A",
                fontSize: 12,
                fontWeight: 700,
                padding: "8px 18px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(249,159,27,0.3)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 6px 24px rgba(249,159,27,0.5)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(249,159,27,0.3)"; }}
            >
              <Check size={12} /> Accept All
            </button>
            <button
              onClick={decline}
              style={{
                fontSize: 12,
                color: "#6A6A7A",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                padding: "8px 16px",
                borderRadius: 8,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#F5F0E8"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#6A6A7A"; }}
            >
              Decline
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
