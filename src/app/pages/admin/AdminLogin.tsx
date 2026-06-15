import { useState } from "react";
import { motion } from "motion/react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { auth } from "../../utils/store";

export function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (auth.login(password)) {
        onLogin();
      } else {
        setError('Incorrect password. Please try again.');
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 20%, rgba(249,159,27,0.06) 0%, transparent 70%)' }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: '100%', maxWidth: 400 }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #F99F1B, #FFD36A)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 28px rgba(249,159,27,0.4)', marginBottom: 16 }}>
            <Lock size={22} color="#0A0A0A" />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 400, color: '#F5F0E8', letterSpacing: '-0.02em', marginBottom: 6 }}>Admin Panel</h1>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#5A5A6A', letterSpacing: '0.1em', textTransform: 'uppercase' }}>BoardOpp · MentorMyBoard</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div
            className="rounded-3xl p-8"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(24px)' }}
          >
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 10, color: '#9B9B9B', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                Admin Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="Enter admin password"
                  autoFocus
                  style={{
                    width: '100%', background: 'rgba(255,255,255,0.05)', border: `1px solid ${error ? '#FF6B6B' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: 10, padding: '12px 44px 12px 16px', color: '#F5F0E8', fontSize: 14, outline: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#5A5A6A', cursor: 'pointer' }}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {error && <p style={{ color: '#FF6B6B', fontSize: 12, marginTop: 6 }}>{error}</p>}
            </div>

            <button
              type="submit"
              disabled={loading || !password}
              style={{
                width: '100%', background: loading || !password ? 'rgba(249,159,27,0.3)' : 'linear-gradient(135deg, #F99F1B, #FFD36A)',
                color: '#0A0A0A', fontSize: 14, fontWeight: 600, padding: '13px 24px', borderRadius: 10, border: 'none',
                cursor: loading || !password ? 'not-allowed' : 'pointer', boxShadow: '0 0 20px rgba(249,159,27,0.2)', transition: 'all 0.2s',
              }}
            >
              {loading ? 'Verifying...' : 'Access Admin Panel'}
            </button>

            <p style={{ color: '#4A4A5A', fontSize: 11, textAlign: 'center', marginTop: 16, fontFamily: 'var(--font-mono)' }}>
              Default password: BoardOpp@2024
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
