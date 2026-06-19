import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { MapPin, Building2, ArrowUpRight } from "lucide-react";

const opportunities = [
  {
    org: "Apex Financial Services",
    industry: "Financial Services",
    role: "Independent Director",
    experience: "20+ years",
    location: "Mumbai, India",
    committee: "Audit & Risk",
    badge: "Priority",
  },
  {
    org: "NovaTech Ventures",
    industry: "Technology",
    role: "Advisory Board Member",
    experience: "15+ years",
    location: "Bengaluru, India",
    committee: "Strategy",
    badge: "New",
  },
  {
    org: "MedCore Health Systems",
    industry: "Healthcare",
    role: "Non-Executive Director",
    experience: "18+ years",
    location: "Delhi NCR, India",
    committee: "Governance",
    badge: "Featured",
  },
  {
    org: "GreenBridge Capital",
    industry: "Sustainable Finance",
    role: "ESG Board Advisor",
    experience: "12+ years",
    location: "Chennai, India",
    committee: "ESG & Sustainability",
    badge: "New",
  },
  {
    org: "InfraCore Industries",
    industry: "Manufacturing",
    role: "Audit Committee Chair",
    experience: "25+ years",
    location: "Pune, India",
    committee: "Audit & Compliance",
    badge: "Priority",
  },
  {
    org: "Luminary Education Group",
    industry: "Education",
    role: "Board of Trustees",
    experience: "15+ years",
    location: "Hyderabad, India",
    committee: "Strategy & Finance",
    badge: "Featured",
  },
];

const badgeColors: Record<string, { bg: string; color: string }> = {
  Priority: { bg: 'rgba(249,159,27,0.15)', color: '#F99F1B' },
  New: { bg: 'rgba(100,200,150,0.12)', color: '#5FCF8A' },
  Featured: { bg: 'rgba(120,130,255,0.12)', color: '#8890FF' },
};

export function BoardOpportunities() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="opportunities" ref={ref} style={{ background: '#08081C', padding: '120px 0' }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
        >
          <div>
            <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full" style={{ background: 'rgba(249,159,27,0.08)', border: '1px solid rgba(249,159,27,0.2)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#F99F1B', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Live opportunities</span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4.5vw,3.5rem)', fontWeight: 600, color: '#F5F0E8', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
              Current Board <em style={{ color: '#F99F1B' }}>Opportunities</em>
            </h2>
          </div>
          <button
            style={{
              background: 'transparent',
              color: '#F99F1B',
              fontSize: 13,
              fontWeight: 500,
              padding: '10px 20px',
              borderRadius: 8,
              border: '1px solid rgba(249,159,27,0.3)',
              cursor: 'none',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(249,159,27,0.08)'; e.currentTarget.style.borderColor = '#F99F1B'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(249,159,27,0.3)'; }}
          >
            View All Opportunities →
          </button>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {opportunities.map((opp, i) => (
            <motion.div
              key={opp.org}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.08 }}
              className="group relative rounded-2xl p-6 overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(16px)',
                transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
                cursor: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(249,159,27,0.05)';
                e.currentTarget.style.borderColor = 'rgba(249,159,27,0.25)';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 20px 50px rgba(249,159,27,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Top row */}
              <div className="flex items-start justify-between mb-5">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(249,159,27,0.1)', border: '1px solid rgba(249,159,27,0.15)' }}
                >
                  <Building2 size={18} color="#F99F1B" />
                </div>
                <div className="flex items-center gap-2">
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      fontWeight: 500,
                      padding: '3px 8px',
                      borderRadius: 4,
                      background: badgeColors[opp.badge]?.bg,
                      color: badgeColors[opp.badge]?.color,
                    }}
                  >
                    {opp.badge}
                  </span>
                  <ArrowUpRight size={15} color="#3A3A4A" className="group-hover:text-[#F99F1B] transition-colors" />
                </div>
              </div>

              {/* Org & Role */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: '#5A5A6A', marginBottom: 4, fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>{opp.industry}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 500, color: '#F5F0E8', lineHeight: 1.2, marginBottom: 2 }}>{opp.org}</h3>
                <div style={{ fontSize: 13, color: '#F99F1B', fontWeight: 500 }}>{opp.role}</div>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 14 }} />

              {/* Meta */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: 12, color: '#5A5A6A' }}>Committee</span>
                  <span style={{ fontSize: 12, color: '#9B9BAB', fontFamily: 'var(--font-mono)' }}>{opp.committee}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: 12, color: '#5A5A6A' }}>Experience</span>
                  <span style={{ fontSize: 12, color: '#9B9BAB', fontFamily: 'var(--font-mono)' }}>{opp.experience}</span>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <MapPin size={11} color="#5A5A6A" />
                  <span style={{ fontSize: 12, color: '#5A5A6A' }}>{opp.location}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
