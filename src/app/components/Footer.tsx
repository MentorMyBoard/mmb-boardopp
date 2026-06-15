import { motion } from "motion/react";
import { Linkedin, Twitter, Mail, Phone, MapPin, Instagram } from "lucide-react";

const links = {
  "For Directors": ["Explore Opportunities", "Director Readiness Assessment", "Build Board Presence", "Join Community", "Governance Programs"],
  "For Organizations": ["Post Board Requirements", "Board Effectiveness", "Governance Consulting", "ESG Governance", "Advisory Boards"],
  "Assessments": ["Director Readiness", "Board Effectiveness", "Governance Maturity", "ESG Readiness"],
  "Resources": ["Governance Insights", "Boardroom Perspectives", "ESG Reports", "MentorMyBoard Blog", "Case Studies"],
};

export function Footer() {
  return (
    <footer
      style={{
        background: '#060608',
        borderTop: '1px solid rgba(249,159,27,0.1)',
        padding: '80px 0 40px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(249,159,27,0.3), transparent)' }} />

      <div className="max-w-7xl mx-auto px-6">
        {/* Top section */}
        <div className="grid lg:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-5">
              <img
                src="/mmb-logo.png"
                alt="MentorMyBoard — BoardOpp"
                style={{ height: 44, width: 'auto', objectFit: 'contain', marginBottom: 4 }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                }}
              />
              {/* Fallback logo */}
              <div style={{ display: 'none', alignItems: 'center', gap: 10 }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F99F1B, #FFD36A)', boxShadow: '0 0 20px rgba(249,159,27,0.35)' }}>
                  <span style={{ fontFamily: 'var(--font-display)', color: '#0A0A0A', fontSize: 16, fontWeight: 700 }}>B</span>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', color: '#F5F0E8', fontSize: 15, fontWeight: 600, lineHeight: 1.1 }}>BoardOpp</div>
                  <div style={{ fontFamily: 'var(--font-mono)', color: '#F99F1B', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase' }}>by MentorMyBoard</div>
                </div>
              </div>
            </div>
            <p style={{ color: '#5A5A6A', fontSize: 12, lineHeight: 1.7, marginBottom: 20 }}>
              India's premier governance ecosystem connecting organizations with board-ready professionals.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Linkedin, href: 'https://www.linkedin.com/company/mentormyboard' },
                { Icon: Twitter, href: 'https://twitter.com/MentorMyBoard' },
                { Icon: Instagram, href: 'https://www.instagram.com/mentormyboard' },
              ].map(({ Icon, href }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#5A5A6A', transition: 'all 0.2s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(249,159,27,0.4)'; e.currentTarget.style.color = '#F99F1B'; e.currentTarget.style.background = 'rgba(249,159,27,0.08)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#5A5A6A'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                >
                  <Icon size={13} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#F99F1B', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14 }}>
                {category}
              </div>
              <div className="flex flex-col gap-2.5">
                {items.map((item) => (
                  <a
                    key={item}
                    href="#"
                    style={{ fontSize: 13, color: '#5A5A6A', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#F5F0E8'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#5A5A6A'; }}
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact bar */}
        <div
          className="flex flex-wrap gap-6 mb-12 p-5 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          {[
            { icon: Mail, text: "info@mentormyboard.com", href: 'mailto:info@mentormyboard.com' },
            { icon: Phone, text: "+91 7304145928", href: 'tel:+917304145928' },
            { icon: MapPin, text: "Office 207, Bldg 3, MBP Road, Millennium Business Park, Mahape, Navi Mumbai 400710", href: null },
          ].map(({ icon: Icon, text, href }) => (
            <div key={text} className="flex items-start gap-2">
              <Icon size={13} color="#F99F1B" style={{ flexShrink: 0, marginTop: 2 }} />
              {href ? (
                <a href={href} style={{ fontSize: 13, color: '#6A6A7A', fontFamily: 'var(--font-mono)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#F99F1B'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#6A6A7A'; }}>{text}</a>
              ) : (
                <span style={{ fontSize: 12, color: '#6A6A7A', fontFamily: 'var(--font-mono)', lineHeight: 1.5 }}>{text}</span>
              )}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-6"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div style={{ fontSize: 12, color: '#3A3A4A', fontFamily: 'var(--font-mono)' }}>
            © 2026 BoardOpp by MentorMyBoard. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            {[
              { label: "Privacy Policy", href: "https://mentormyboard.com/privacy-policy" },
              { label: "Terms & Conditions", href: "https://mentormyboard.com/terms-and-condition" },
              { label: "Cookie Policy", href: "https://mentormyboard.com/privacy-policy#cookies" },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 11, color: '#3A3A4A', fontFamily: 'var(--font-mono)', transition: 'color 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#F99F1B'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#3A3A4A'; }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
