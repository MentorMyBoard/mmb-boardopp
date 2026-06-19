import { useState } from "react";
import { content, auth } from "../../utils/store";
import type { SiteContent } from "../../utils/store";
import { Save, RotateCcw, Check, Lock } from "lucide-react";

export function AdminContent() {
  const [cfg, setCfg] = useState<SiteContent>(content.get());
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'hero' | 'urls' | 'contact' | 'password'>('hero');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwSaved, setPwSaved] = useState(false);

  const upd = (key: keyof SiteContent, value: string) => {
    setCfg((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    content.update(cfg);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    if (confirm('Reset all content to defaults?')) {
      content.reset();
      setCfg(content.get());
    }
  };

  const handlePasswordChange = () => {
    if (!newPassword || newPassword.length < 8) { setPwError('Password must be at least 8 characters.'); return; }
    if (newPassword !== confirmPassword) { setPwError('Passwords do not match.'); return; }
    auth.changePassword(newPassword);
    setNewPassword(''); setConfirmPassword(''); setPwError(''); setPwSaved(true);
    setTimeout(() => setPwSaved(false), 2500);
  };

  const tabs = [
    { id: 'hero', label: 'Hero & CTA' },
    { id: 'urls', label: 'Assessment URLs' },
    { id: 'contact', label: 'Contact Info' },
    { id: 'password', label: 'Security' },
  ] as const;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ color: '#F5F0E8', fontSize: 20, fontWeight: 500, marginBottom: 4 }}>Site Content</h2>
          <p style={{ color: '#6A6A7A', fontSize: 13 }}>Edit website content without touching code.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={handleReset} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#9B9BAB', fontSize: 13, padding: '9px 16px', borderRadius: 9, cursor: 'pointer' }}>
            <RotateCcw size={13} /> Reset Defaults
          </button>
          {activeTab !== 'password' && (
            <button onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: 8, background: saved ? 'rgba(95,207,138,0.15)' : '#F99F1B', border: saved ? '1px solid rgba(95,207,138,0.3)' : 'none', color: saved ? '#5FCF8A' : '#0A0A0A', fontSize: 13, fontWeight: 600, padding: '9px 18px', borderRadius: 9, cursor: 'pointer', transition: 'all 0.3s' }}>
              {saved ? <><Check size={13} /> Saved!</> : <><Save size={13} /> Save Changes</>}
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: '#1A1A1D', padding: 4, borderRadius: 12, width: 'fit-content' }}>
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '7px 16px', borderRadius: 9, border: 'none', background: activeTab === tab.id ? 'rgba(249,159,27,0.1)' : 'transparent', color: activeTab === tab.id ? '#F99F1B' : '#6A6A7A', fontSize: 13, cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ background: '#1A1A1D', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: 28 }}>
        {activeTab === 'hero' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <h3 style={{ color: '#F5F0E8', fontSize: 15, fontWeight: 500, marginBottom: 4 }}>Hero Section</h3>
            <Fld label="Hero Title">
              <textarea value={cfg.heroTitle} onChange={(e) => upd('heroTitle', e.target.value)} rows={2} style={ta} />
            </Fld>
            <Fld label="Hero Subtitle">
              <textarea value={cfg.heroSubtitle} onChange={(e) => upd('heroSubtitle', e.target.value)} rows={3} style={ta} />
            </Fld>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Fld label="Primary CTA Button Text"><input value={cfg.heroCtaPrimary} onChange={(e) => upd('heroCtaPrimary', e.target.value)} style={inp} /></Fld>
              <Fld label="Secondary CTA Button Text"><input value={cfg.heroCtaSecondary} onChange={(e) => upd('heroCtaSecondary', e.target.value)} style={inp} /></Fld>
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 20 }}>
              <h3 style={{ color: '#F5F0E8', fontSize: 15, fontWeight: 500, marginBottom: 16 }}>Footer</h3>
              <Fld label="Footer Tagline"><input value={cfg.footerTagline} onChange={(e) => upd('footerTagline', e.target.value)} style={inp} /></Fld>
            </div>
          </div>
        )}

        {activeTab === 'urls' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <h3 style={{ color: '#F5F0E8', fontSize: 15, fontWeight: 500, marginBottom: 4 }}>Assessment URLs</h3>
            <p style={{ color: '#5A5A6A', fontSize: 13, lineHeight: 1.6 }}>
              These URLs are used in the post-registration success cards shown to directors and companies after form submission.
            </p>
            <Fld label="Director Assessment Card URL (shown after director registration)">
              <input value={cfg.assessmentCardUrl} onChange={(e) => upd('assessmentCardUrl', e.target.value)} placeholder="https://assessment.mentormyboard.com/director" style={inp} />
              <p style={{ color: '#5A5A6A', fontSize: 11, marginTop: 6 }}>Button: "Take Assessment" → goes to Director Readiness Assessment</p>
            </Fld>
            <Fld label="Board Assessment URL (shown after company registration)">
              <input value={cfg.boardAssessmentUrl} onChange={(e) => upd('boardAssessmentUrl', e.target.value)} placeholder="https://assessment.mentormyboard.com/board" style={inp} />
              <p style={{ color: '#5A5A6A', fontSize: 11, marginTop: 6 }}>Button: "Take Board Assessment" → goes to Board Effectiveness Review</p>
            </Fld>
          </div>
        )}

        {activeTab === 'contact' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <h3 style={{ color: '#F5F0E8', fontSize: 15, fontWeight: 500, marginBottom: 4 }}>Contact Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Fld label="Contact Email"><input type="email" value={cfg.contactEmail} onChange={(e) => upd('contactEmail', e.target.value)} style={inp} /></Fld>
              <Fld label="Contact Phone"><input value={cfg.contactPhone} onChange={(e) => upd('contactPhone', e.target.value)} style={inp} /></Fld>
            </div>
          </div>
        )}

        {activeTab === 'password' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 400 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <Lock size={16} color="#F99F1B" />
              <h3 style={{ color: '#F5F0E8', fontSize: 15, fontWeight: 500 }}>Change Admin Password</h3>
            </div>
            <Fld label="New Password">
              <input type="password" value={newPassword} onChange={(e) => { setNewPassword(e.target.value); setPwError(''); }} style={inp} />
            </Fld>
            <Fld label="Confirm New Password">
              <input type="password" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setPwError(''); }} style={inp} />
            </Fld>
            {pwError && <p style={{ color: '#FF6B6B', fontSize: 12 }}>{pwError}</p>}
            <button
              onClick={handlePasswordChange}
              style={{ display: 'flex', alignItems: 'center', gap: 8, background: pwSaved ? 'rgba(95,207,138,0.15)' : '#F99F1B', border: pwSaved ? '1px solid rgba(95,207,138,0.3)' : 'none', color: pwSaved ? '#5FCF8A' : '#0A0A0A', fontSize: 13, fontWeight: 600, padding: '11px 20px', borderRadius: 9, cursor: 'pointer', width: 'fit-content' }}
            >
              {pwSaved ? <><Check size={13} /> Password Changed!</> : 'Update Password'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Fld({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 10, color: '#7A7A8A', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>{label}</label>{children}</div>;
}
const inp: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 9, padding: '11px 14px', color: '#F5F0E8', fontSize: 14, outline: 'none' };
const ta: React.CSSProperties = { ...inp, resize: 'vertical', lineHeight: 1.6 };
