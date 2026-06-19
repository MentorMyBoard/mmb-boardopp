import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Compass, TrendingUp, CheckSquare, Users, Briefcase, Search, BarChart2, Shield } from "lucide-react";

const directorItems = [
  { icon: Compass, title: "Explore Opportunities", desc: "Discover board roles that match your expertise and governance vision" },
  { icon: TrendingUp, title: "Build Board Presence", desc: "Establish your credibility in the governance ecosystem" },
  { icon: CheckSquare, title: "Assess Board Readiness", desc: "Take structured assessments to gauge your boardroom preparedness" },
  { icon: Users, title: "Join Governance Community", desc: "Connect with 2,000+ governance professionals across industries" },
];

const companyItems = [
  { icon: Briefcase, title: "Post Board Requirements", desc: "Define the governance talent your board needs" },
  { icon: Search, title: "Discover Governance Talent", desc: "Access pre-vetted directors, advisors, and ESG specialists" },
  { icon: BarChart2, title: "Assess Governance Maturity", desc: "Benchmark your board's effectiveness against best practices" },
  { icon: Shield, title: "Strengthen Board Effectiveness", desc: "Build a high-performing board with expert guidance" },
];

export function WhoIsItFor() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="who" ref={ref} style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F5F2EA 100%)', padding: '120px 0', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative gradient blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(249,159,27,0.07) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(249,159,27,0.05) 0%, transparent 70%)', transform: 'translate(-30%, 30%)' }} />

      <div className="max-w-7xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full" style={{ background: 'rgba(249,159,27,0.1)', border: '1px solid rgba(249,159,27,0.25)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#C47E0F', letterSpacing: '0.12em', textTransform: 'uppercase' }}>BoardOpp is designed for</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4.5vw,3.5rem)', fontWeight: 600, color: '#1A1A2A', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
            Who is <em style={{ color: '#F99F1B' }}>BoardOpp</em> For?
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Directors */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="group relative rounded-2xl p-8 overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.85)',
              border: '1px solid rgba(0,0,0,0.06)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
              transition: 'border-color 0.3s, box-shadow 0.3s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(249,159,27,0.35)';
              e.currentTarget.style.boxShadow = '0 20px 60px rgba(249,159,27,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)';
              e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.06)';
            }}
          >
            <div
              className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-30 blur-3xl pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(249,159,27,0.3), transparent)', transform: 'translate(30%, -30%)' }}
            />
            <div className="relative">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#F99F1B', boxShadow: '0 4px 12px rgba(249,159,27,0.3)' }}>
                  <Users size={18} color="#0A0A0A" />
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#C47E0F', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2 }}>For</div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 500, color: '#1A1A2A', lineHeight: 1.1 }}>Directors & Leaders</h3>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                {directorItems.map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                    className="flex items-start gap-4 p-4 rounded-xl group/item"
                    style={{
                      background: 'rgba(249,159,27,0.03)',
                      border: '1px solid transparent',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(249,159,27,0.08)';
                      e.currentTarget.style.borderColor = 'rgba(249,159,27,0.25)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(249,159,27,0.03)';
                      e.currentTarget.style.borderColor = 'transparent';
                    }}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(249,159,27,0.12)', border: '1px solid rgba(249,159,27,0.2)' }}>
                      <item.icon size={15} color="#F99F1B" />
                    </div>
                    <div>
                      <div style={{ color: '#1A1A2A', fontSize: 14, fontWeight: 500, marginBottom: 3 }}>{item.title}</div>
                      <div style={{ color: '#5A5A6A', fontSize: 13, lineHeight: 1.5 }}>{item.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Companies */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="group relative rounded-2xl p-8 overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.85)',
              border: '1px solid rgba(0,0,0,0.06)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
              transition: 'border-color 0.3s, box-shadow 0.3s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(249,159,27,0.35)';
              e.currentTarget.style.boxShadow = '0 20px 60px rgba(249,159,27,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)';
              e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.06)';
            }}
          >
            <div
              className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(249,159,27,0.3), transparent)', transform: 'translate(-30%, 30%)' }}
            />
            <div className="relative">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(249,159,27,0.1)', border: '1px solid rgba(249,159,27,0.25)', boxShadow: '0 4px 12px rgba(249,159,27,0.15)' }}>
                  <Briefcase size={18} color="#F99F1B" />
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#C47E0F', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2 }}>For</div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 500, color: '#1A1A2A', lineHeight: 1.1 }}>Companies & Organizations</h3>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                {companyItems.map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: 20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                    className="flex items-start gap-4 p-4 rounded-xl"
                    style={{
                      background: 'rgba(249,159,27,0.03)',
                      border: '1px solid transparent',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(249,159,27,0.08)';
                      e.currentTarget.style.borderColor = 'rgba(249,159,27,0.25)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(249,159,27,0.03)';
                      e.currentTarget.style.borderColor = 'transparent';
                    }}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(249,159,27,0.12)', border: '1px solid rgba(249,159,27,0.2)' }}>
                      <item.icon size={15} color="#F99F1B" />
                    </div>
                    <div>
                      <div style={{ color: '#1A1A2A', fontSize: 14, fontWeight: 500, marginBottom: 3 }}>{item.title}</div>
                      <div style={{ color: '#5A5A6A', fontSize: 13, lineHeight: 1.5 }}>{item.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
