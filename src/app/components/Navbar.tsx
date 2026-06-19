import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ChevronDown, UserCircle, Building2 } from "lucide-react";
import { useNavigate } from "react-router";
import mmbLogoWhite from "../../imports/MMB_ISO_Logo_White.png";

const navLinks = [
  { label: "Who It's For", href: "#who" },
  { label: "Assessments", href: "#assessments" },
  {
    label: "Board Vacancy",
    href: "#vacancy",
    dropdown: [
      { label: "Find Opportunities", desc: "Register as a director or leader", href: "/join", icon: UserCircle },
      { label: "Post Opportunity", desc: "List your governance requirement", href: "/post-requirement", icon: Building2 },
    ],
  },
  { label: "Ecosystem", href: "#ecosystem" },
  { label: "Partners", href: "#partners" },
  { label: "Explore MMB", href: "#mmb-ecosystem", highlight: true },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handle);
    return () => window.removeEventListener('scroll', handle);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleNavClick = (href: string) => {
    if (href.startsWith('/')) {
      navigate(href);
    } else if (href.startsWith('#')) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    setMenuOpen(false);
    setActiveDropdown(null);
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-[900]"
      style={{
        background: scrolled ? 'rgba(10,10,10,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(249,159,27,0.1)' : '1px solid transparent',
        transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between" style={{ height: 72 }}>
        {/* Logo */}
        <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="flex items-center gap-3 group">
          <img
            src={mmbLogoWhite}
            alt="MentorMyBoard — BoardOpp"
            style={{ height: 40, width: 'auto', objectFit: 'contain' }}
          />
        </a>

        {/* Desktop links */}
        <div ref={dropdownRef} className="hidden md:flex items-center gap-8 relative">
          {navLinks.map((link) => (
            <div key={link.label} className="relative">
              {link.dropdown ? (
                <button
                  className="flex items-center gap-1"
                  style={{ color: activeDropdown === link.label ? '#F99F1B' : '#9B9B9B', fontSize: 13, fontWeight: 400, letterSpacing: '0.02em', background: 'none', border: 'none', cursor: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={() => { setActiveDropdown(link.label); }}
                  onClick={() => {
                    setActiveDropdown(activeDropdown === link.label ? null : link.label);
                    handleNavClick(link.href);
                  }}
                >
                  {link.label}
                  <ChevronDown
                    size={12}
                    style={{ transition: 'transform 0.2s', transform: activeDropdown === link.label ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  />
                </button>
              ) : link.highlight ? (
                <button
                  onClick={() => handleNavClick(link.href)}
                  style={{
                    color: '#191970', fontSize: 12, fontWeight: 600, letterSpacing: '0.04em',
                    background: 'rgba(25,25,112,0.15)', border: '1px solid rgba(25,25,112,0.4)',
                    borderRadius: 7, padding: '5px 12px', cursor: 'none', transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#191970';
                    e.currentTarget.style.color = '#F0EDE8';
                    e.currentTarget.style.borderColor = '#191970';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(25,25,112,0.15)';
                    e.currentTarget.style.color = '#191970';
                    e.currentTarget.style.borderColor = 'rgba(25,25,112,0.4)';
                  }}
                >
                  {link.label}
                </button>
              ) : (
                <button
                  onClick={() => handleNavClick(link.href)}
                  style={{ color: '#9B9B9B', fontSize: 13, fontWeight: 400, letterSpacing: '0.02em', background: 'none', border: 'none', cursor: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#F99F1B')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#9B9B9B')}
                >
                  {link.label}
                </button>
              )}

              {/* Dropdown */}
              {link.dropdown && (
                <AnimatePresence>
                  {activeDropdown === link.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      onMouseLeave={() => setActiveDropdown(null)}
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 12px)',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 260,
                        background: 'rgba(12,12,12,0.96)',
                        backdropFilter: 'blur(24px)',
                        border: '1px solid rgba(249,159,27,0.2)',
                        borderRadius: 14,
                        padding: 8,
                        boxShadow: '0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(249,159,27,0.05)',
                        zIndex: 1000,
                      }}
                    >
                      {/* Arrow */}
                      <div style={{ position: 'absolute', top: -6, left: '50%', transform: 'translateX(-50%)', width: 12, height: 6, overflow: 'hidden' }}>
                        <div style={{ width: 12, height: 12, background: 'rgba(249,159,27,0.2)', transform: 'rotate(45deg)', marginTop: 3, marginLeft: 0 }} />
                      </div>

                      {link.dropdown.map((item) => (
                        <button
                          key={item.label}
                          onClick={() => handleNavClick(item.href)}
                          className="w-full flex items-start gap-3 p-3 rounded-xl text-left"
                          style={{ background: 'transparent', border: 'none', cursor: 'none', transition: 'background 0.2s' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(249,159,27,0.08)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                        >
                          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(249,159,27,0.1)', border: '1px solid rgba(249,159,27,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <item.icon size={14} color="#F99F1B" />
                          </div>
                          <div>
                            <div style={{ color: '#F5F0E8', fontSize: 13, fontWeight: 500 }}>{item.label}</div>
                            <div style={{ color: '#6A6A7A', fontSize: 11, marginTop: 2 }}>{item.desc}</div>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => navigate('/join')}
            style={{ color: '#F5F0E8', fontSize: 13, fontWeight: 500, padding: '8px 16px', border: '1px solid rgba(249,159,27,0.3)', borderRadius: 8, background: 'transparent', cursor: 'none', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(249,159,27,0.8)'; e.currentTarget.style.color = '#F99F1B'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(249,159,27,0.3)'; e.currentTarget.style.color = '#F5F0E8'; }}
          >
            Join the Boardroom
          </button>
          <button
            onClick={() => navigate('/post-requirement')}
            style={{ background: '#F99F1B', color: '#0A0A0A', fontSize: 13, fontWeight: 600, padding: '8px 18px', borderRadius: 8, border: 'none', boxShadow: '0 0 20px rgba(249,159,27,0.3)', cursor: 'none', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 30px rgba(249,159,27,0.5)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 0 20px rgba(249,159,27,0.3)'; }}
          >
            Post Requirement
          </button>
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden p-2" style={{ color: '#F5F0E8', background: 'none', border: 'none', cursor: 'none' }} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden px-6 pb-6 flex flex-col gap-4 overflow-hidden"
            style={{ background: 'rgba(10,10,10,0.98)', backdropFilter: 'blur(24px)' }}
          >
            {navLinks.map((link) => (
              <div key={link.label}>
                <button
                  onClick={() => link.dropdown ? null : handleNavClick(link.href)}
                  style={link.highlight
                    ? { color: '#7B8CDE', fontSize: 14, fontWeight: 600, background: 'rgba(25,25,112,0.15)', border: '1px solid rgba(25,25,112,0.3)', borderRadius: 8, padding: '8px 14px', cursor: 'none', width: '100%', textAlign: 'left' }
                    : { color: '#9B9B9B', fontSize: 15, background: 'none', border: 'none', cursor: 'none', padding: '4px 0', width: '100%', textAlign: 'left' }}
                >
                  {link.label}
                </button>
                {link.dropdown && (
                  <div className="ml-4 mt-2 flex flex-col gap-2">
                    {link.dropdown.map((sub) => (
                      <button
                        key={sub.label}
                        onClick={() => handleNavClick(sub.href)}
                        style={{ color: '#F99F1B', fontSize: 13, background: 'none', border: 'none', cursor: 'none', textAlign: 'left' }}
                      >
                        → {sub.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <button
              onClick={() => navigate('/post-requirement')}
              style={{ background: '#F99F1B', color: '#0A0A0A', fontSize: 14, fontWeight: 600, padding: '10px 16px', borderRadius: 8, textAlign: 'center', border: 'none', cursor: 'none' }}
            >
              Post Requirement
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
