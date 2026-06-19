import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Upload, Star, RotateCcw, Home } from "lucide-react";
import { useNavigate } from "react-router";
import { directors, content } from "../utils/store";
import { useSEO } from "../hooks/useSEO";
import { CustomCursor } from "../components/CustomCursor";
const STEPS = ["Personal Info", "Professional Details", "Board Experience", "Preferences"];

const INDUSTRIES = ["Financial Services", "Technology", "Healthcare & Pharma", "Manufacturing", "Energy & Infrastructure", "FMCG & Retail", "Real Estate", "Education", "Media & Entertainment", "Government & PSU", "Other"];
const ROLES = ["Independent Director", "Advisory Board Member", "Non-Executive Director", "Committee Member", "ESG Board Advisor", "Audit Committee Chair", "Governance Consultant", "Board Trustee"];
const EXPERTISE_OPTIONS = ["Corporate Governance", "Risk Management", "Audit & Compliance", "ESG & Sustainability", "Digital Strategy", "Financial Oversight", "Legal & Regulatory", "Strategy & M&A", "Operations", "HR & Compensation", "Marketing & Brand", "Technology & Innovation"];

interface FormData {
  name: string;
  email: string;
  phone: string;
  designation: string;
  industry: string;
  experience: string;
  boardExperience: string;
  linkedin: string;
  expertise: string[];
  preferredRole: string;
  location: string;
  resumeName: string;
}

const defaultForm: FormData = {
  name: '', email: '', phone: '', designation: '', industry: '', experience: '', boardExperience: '', linkedin: '', expertise: [], preferredRole: '', location: '', resumeName: '',
};

const WHATSAPP_URL = "https://wa.me/918655430211";

function SuccessCard({ assessmentUrl }: { assessmentUrl: string }) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center justify-center min-h-screen px-6"
      style={{
        background: 'radial-gradient(ellipse 90% 70% at 20% 20%, rgba(25,25,112,0.5) 0%, transparent 60%), radial-gradient(ellipse 70% 50% at 80% 80%, rgba(249,159,27,0.08) 0%, transparent 60%), #08081C',
      }}
    >
      {/* Midnight blue ambient flare */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          style={{ position: 'absolute', top: '-20%', left: '-10%', width: '60%', height: '60%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(25,25,112,0.3) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '40%', height: '40%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(25,25,112,0.2) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
      </div>

      <div className="relative text-center max-w-lg w-full">
        {/* Success check */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8"
          style={{ background: '#F99F1B', boxShadow: '0 0 40px rgba(249,159,27,0.4), 0 0 80px rgba(25,25,112,0.3)' }}
        >
          <Check size={36} color="#0A0A0A" strokeWidth={2.5} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#F99F1B', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Profile Registered ✓</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 600, color: '#F5F0E8', lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 16 }}>
            Welcome to the Boardroom.
          </h2>
          <p style={{ color: '#7A7A8A', fontSize: 15, lineHeight: 1.7, marginBottom: 36 }}>
            Your profile has been received. Our team will review and connect you with relevant board opportunities within 5–7 business days.
          </p>
        </motion.div>

        {/* Assessment card */}
        <motion.div
          animate={{ rotateY: [0, 4, -4, 0], y: [0, -6, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="relative rounded-3xl p-8 mx-auto mb-8"
          style={{
            maxWidth: 380,
            background: 'linear-gradient(135deg, rgba(25,25,112,0.2) 0%, rgba(255,255,255,0.04) 100%)',
            border: '1px solid rgba(25,25,112,0.5)',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 0 60px rgba(25,25,112,0.25), 0 0 30px rgba(249,159,27,0.1), 0 32px 80px rgba(0,0,0,0.4)',
            transformStyle: 'preserve-3d',
          }}
        >
          <motion.div
            className="absolute inset-0 rounded-3xl pointer-events-none"
            animate={{ boxShadow: ['0 0 20px rgba(25,25,112,0.2)', '0 0 50px rgba(25,25,112,0.4)', '0 0 20px rgba(25,25,112,0.2)'] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <div className="flex items-center gap-3 mb-5">
            {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#F99F1B" color="#F99F1B" />)}
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, color: '#F5F0E8', lineHeight: 1.2, marginBottom: 12, letterSpacing: '-0.02em' }}>
            How Board Ready Are You?
          </h3>
          <p style={{ color: '#7A7A8A', fontSize: 14, lineHeight: 1.65, marginBottom: 24 }}>
            Take our Director Readiness Assessment and discover where you stand as a future board leader.
          </p>
          <a
            href={assessmentUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#F99F1B', color: '#0A0A0A', fontSize: 13, fontWeight: 600, padding: '12px 22px', borderRadius: 9, border: 'none', cursor: 'pointer', boxShadow: '0 0 20px rgba(249,159,27,0.35)', textDecoration: 'none' }}
          >
            Take Assessment <ArrowRight size={14} />
          </a>
        </motion.div>

        {/* Action row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          {/* WhatsApp */}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: 'linear-gradient(135deg, #191970, #25D366)',
              color: '#fff', fontSize: 13, fontWeight: 600,
              padding: '12px 22px', borderRadius: 10, textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(25,25,112,0.4)',
              transition: 'box-shadow 0.2s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 32px rgba(25,25,112,0.6)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(25,25,112,0.4)'; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Discuss on WhatsApp
          </a>

          {/* Go Home */}
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(25,25,112,0.15)',
              border: '1px solid rgba(25,25,112,0.5)',
              color: '#A0A8F0', fontSize: 13, fontWeight: 500,
              padding: '12px 22px', borderRadius: 10, cursor: 'none',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(25,25,112,0.3)'; e.currentTarget.style.borderColor = 'rgba(25,25,112,0.8)'; e.currentTarget.style.color = '#F5F0E8'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(25,25,112,0.15)'; e.currentTarget.style.borderColor = 'rgba(25,25,112,0.5)'; e.currentTarget.style.color = '#A0A8F0'; }}
          >
            <Home size={14} /> Go to Home Page
          </button>
        </motion.div>
      </div>

    </motion.div>
  );
}

export function DirectorPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(defaultForm);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitting, setSubmitting] = useState(false);
  const cfg = content.get();

  useSEO({
    title: "Register as Independent Director | BoardOpp by MentorMyBoard",
    description: "Join India's premier governance ecosystem. Register your director profile on BoardOpp — share your board experience, areas of expertise, and preferred board roles. Get connected with leading organizations seeking governance professionals.",
    keywords: "register as independent director India, board seat registration, director profile India, independent director registration, board governance India, join board India, MentorMyBoard director registration",
    canonical: "https://boardopp.mentormyboard.com/join",
    ogTitle: "Register as a Director | BoardOpp",
    ogDescription: "Build your board profile on India's premier governance ecosystem. Connect with organizations seeking independent directors, ESG advisors, and governance leaders.",
    schema: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Director Registration — BoardOpp",
      "description": "Register as an Independent Director on BoardOpp by MentorMyBoard",
      "url": "https://boardopp.mentormyboard.com/join",
      "isPartOf": { "@id": "https://boardopp.mentormyboard.com/#website" },
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://boardopp.mentormyboard.com" },
          { "@type": "ListItem", "position": 2, "name": "Register as Director", "item": "https://boardopp.mentormyboard.com/join" }
        ]
      }
    },
  });

  const update = (field: keyof FormData, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const toggleExpertise = (tag: string) => {
    const cur = form.expertise;
    if (cur.includes(tag)) update('expertise', cur.filter((t) => t !== tag));
    else if (cur.length < 6) update('expertise', [...cur, tag]);
  };

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (step === 0) {
      if (!form.name.trim()) e.name = 'Required';
      if (!form.email.match(/^[^@]+@[^@]+\.[^@]+$/)) e.email = 'Valid email required';
      if (!form.phone.match(/^\+?[\d\s\-()]{7,}$/)) e.phone = 'Valid phone required';
    }
    if (step === 1) {
      if (!form.designation.trim()) e.designation = 'Required';
      if (!form.industry) e.industry = 'Select industry';
      if (!form.experience) e.experience = 'Select experience';
    }
    if (step === 2) {
      if (!form.boardExperience) e.boardExperience = 'Select board experience';
    }
    if (step === 3) {
      if (!form.preferredRole) e.preferredRole = 'Select preferred role';
      if (!form.location.trim()) e.location = 'Required';
    }
    setErrors(e as Partial<FormData>);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validate()) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const back = () => setStep((s) => Math.max(s - 1, 0));

  const submit = async () => {
    if (!validate()) return;
    setSubmitting(true);

    const payload = {
      name: form.name, email: form.email, phone: form.phone,
      designation: form.designation, industry: form.industry,
      experience: form.experience, boardExperience: form.boardExperience,
      linkedin: form.linkedin, expertise: form.expertise,
      preferredRole: form.preferredRole, location: form.location,
      resumeName: form.resumeName,
    };

    // Save to localStorage for admin panel
    directors.add({ ...payload, expertise: form.expertise.join(', ') });

    // Submit to backend (email + DB + Zoho CRM)
    try {
      await fetch('/api/director', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch {
      // Backend unavailable in local-only mode — localStorage still saved
    }

    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) return <><CustomCursor /><SuccessCard assessmentUrl={cfg.assessmentCardUrl} /></>;

  return (
    <><CustomCursor />
    <div style={{ minHeight: '100vh', background: 'radial-gradient(ellipse 80% 60% at 30% -10%, rgba(25,25,112,0.7) 0%, rgba(25,25,112,0.1) 50%, #0A0A0A 80%)', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar */}
      <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2"
          style={{ color: '#9B9B9B', fontSize: 13, background: 'none', border: 'none', cursor: 'none', transition: 'color 0.2s' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#F99F1B')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#9B9B9B')}
        >
          <ArrowLeft size={15} /> Back to BoardOpp
        </button>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#5A5A6A', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Step {step + 1} of {STEPS.length}
        </div>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full px-6 py-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full" style={{ background: 'rgba(249,159,27,0.08)', border: '1px solid rgba(249,159,27,0.2)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#F99F1B', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Director Registration</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 600, color: '#F5F0E8', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
            Join the <em style={{ color: '#F99F1B' }}>Boardroom</em>
          </h1>
          <p style={{ color: '#7A7A8A', fontSize: 14, lineHeight: 1.65, marginTop: 12, maxWidth: 460, margin: '12px auto 0' }}>
            Register your governance profile and become visible to future board opportunities across India's leading organizations.
          </p>
        </motion.div>

        {/* Progress */}
        <div className="flex items-center gap-3 mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-3 flex-1">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <div
                  style={{
                    width: 28, height: 28, borderRadius: '50%', border: i <= step ? 'none' : '1px solid rgba(255,255,255,0.15)',
                    background: i < step ? '#F99F1B' : i === step ? '#F99F1B' : 'rgba(255,255,255,0.04)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: i === step ? '0 0 12px rgba(249,159,27,0.4)' : 'none',
                    transition: 'all 0.3s',
                    flexShrink: 0,
                  }}
                >
                  {i < step ? <Check size={12} color="#0A0A0A" strokeWidth={2.5} /> : <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: i === step ? '#0A0A0A' : '#5A5A6A' }}>{i + 1}</span>}
                </div>
                <span className="hidden sm:block" style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: i === step ? '#F99F1B' : i < step ? '#9B9B9B' : '#4A4A5A', letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ flex: 1, height: 1, background: i < step ? 'rgba(249,159,27,0.5)' : 'rgba(255,255,255,0.08)', transition: 'background 0.3s' }} />
              )}
            </div>
          ))}
        </div>

        {/* Form */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-3xl p-8"
            style={{ background: 'linear-gradient(135deg, rgba(25,25,112,0.12) 0%, rgba(255,255,255,0.03) 100%)', border: '1px solid rgba(25,25,112,0.35)', backdropFilter: 'blur(24px)', boxShadow: '0 0 40px rgba(25,25,112,0.15)' }}
          >
            {step === 0 && (
              <div className="flex flex-col gap-5">
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: '#F5F0E8', marginBottom: 4 }}>Personal Information</h3>
                <Field label="Full Name *" error={errors.name}>
                  <input value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="e.g. Rajesh Kumar" style={inputStyle} />
                </Field>
                <Field label="Email Address *" error={errors.email}>
                  <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com" style={inputStyle} />
                </Field>
                <Field label="Phone Number *" error={errors.phone}>
                  <input value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+91 98765 43210" style={inputStyle} />
                </Field>
                <Field label="LinkedIn Profile">
                  <input value={form.linkedin} onChange={(e) => update('linkedin', e.target.value)} placeholder="linkedin.com/in/yourprofile" style={inputStyle} />
                </Field>
              </div>
            )}

            {step === 1 && (
              <div className="flex flex-col gap-5">
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: '#F5F0E8', marginBottom: 4 }}>Professional Details</h3>
                <Field label="Current Designation *" error={errors.designation}>
                  <input value={form.designation} onChange={(e) => update('designation', e.target.value)} placeholder="e.g. Managing Director, CFO, President" style={inputStyle} />
                </Field>
                <Field label="Industry *" error={errors.industry}>
                  <select value={form.industry} onChange={(e) => update('industry', e.target.value)} style={inputStyle}>
                    <option value="">Select Industry</option>
                    {INDUSTRIES.map((ind) => <option key={ind} value={ind}>{ind}</option>)}
                  </select>
                </Field>
                <Field label="Years of Experience *" error={errors.experience}>
                  <select value={form.experience} onChange={(e) => update('experience', e.target.value)} style={inputStyle}>
                    <option value="">Select Range</option>
                    {['5–10 years', '10–15 years', '15–20 years', '20–25 years', '25–30 years', '30+ years'].map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </Field>
                <Field label="Upload Resume (Optional)">
                  <label style={{ ...inputStyle, display: 'flex', alignItems: 'center', gap: 10, cursor: 'none' }}>
                    <Upload size={14} color="#F99F1B" />
                    <span style={{ color: form.resumeName ? '#F5F0E8' : '#5A5A6A' }}>{form.resumeName || 'Choose PDF or Word file'}</span>
                    <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) update('resumeName', f.name); }} />
                  </label>
                </Field>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-5">
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: '#F5F0E8', marginBottom: 4 }}>Board Experience</h3>
                <Field label="Previous Board Experience *" error={errors.boardExperience}>
                  <select value={form.boardExperience} onChange={(e) => update('boardExperience', e.target.value)} style={inputStyle}>
                    <option value="">Select</option>
                    <option value="None – first board role">None – first board role</option>
                    <option value="1–2 boards">1–2 boards</option>
                    <option value="3–5 boards">3–5 boards</option>
                    <option value="5+ boards">5+ boards</option>
                  </select>
                </Field>
                <Field label="Areas of Expertise (select up to 6)" error={errors.expertise as unknown as string}>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {EXPERTISE_OPTIONS.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleExpertise(tag)}
                        style={{
                          fontSize: 12, padding: '6px 12px', borderRadius: 20, border: 'none', cursor: 'none', transition: 'all 0.2s',
                          background: form.expertise.includes(tag) ? 'rgba(249,159,27,0.2)' : 'rgba(255,255,255,0.06)',
                          color: form.expertise.includes(tag) ? '#F99F1B' : '#7A7A8A',
                          outline: form.expertise.includes(tag) ? '1px solid rgba(249,159,27,0.4)' : '1px solid rgba(255,255,255,0.08)',
                        }}
                      >
                        {form.expertise.includes(tag) && '✓ '}{tag}
                      </button>
                    ))}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#5A5A6A', marginTop: 8 }}>{form.expertise.length}/6 selected</div>
                </Field>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col gap-5">
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: '#F5F0E8', marginBottom: 4 }}>Preferences</h3>
                <Field label="Preferred Board Role *" error={errors.preferredRole}>
                  <select value={form.preferredRole} onChange={(e) => update('preferredRole', e.target.value)} style={inputStyle}>
                    <option value="">Select Role</option>
                    {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </Field>
                <Field label="Preferred Location *" error={errors.location}>
                  <input value={form.location} onChange={(e) => update('location', e.target.value)} placeholder="e.g. Mumbai, Pan-India, Remote" style={inputStyle} />
                </Field>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 20, marginTop: 4 }}>
                  <p style={{ color: '#5A5A6A', fontSize: 12, lineHeight: 1.6 }}>
                    By submitting, you agree to let MentorMyBoard share your profile with relevant organizations seeking governance leaders. Your data is kept strictly confidential.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={back}
            disabled={step === 0}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              color: step === 0 ? '#3A3A4A' : '#9B9B9B', fontSize: 13, background: 'none', border: 'none',
              cursor: step === 0 ? 'not-allowed' : 'none', opacity: step === 0 ? 0.4 : 1, transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => { if (step > 0) e.currentTarget.style.color = '#F5F0E8'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = step === 0 ? '#3A3A4A' : '#9B9B9B'; }}
          >
            <ArrowLeft size={15} /> Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              onClick={next}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: '#F99F1B', color: '#0A0A0A',
                fontSize: 13, fontWeight: 600, padding: '12px 24px', borderRadius: 9, border: 'none',
                cursor: 'none', boxShadow: '0 0 20px rgba(249,159,27,0.3)', transition: 'box-shadow 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 35px rgba(249,159,27,0.5)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 0 20px rgba(249,159,27,0.3)'; }}
            >
              Continue <ArrowRight size={15} />
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={submitting}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: submitting ? 'rgba(249,159,27,0.5)' : '#F99F1B',
                color: '#0A0A0A', fontSize: 13, fontWeight: 600, padding: '12px 28px',
                borderRadius: 9, border: 'none', cursor: submitting ? 'not-allowed' : 'none',
                boxShadow: '0 0 24px rgba(249,159,27,0.35)', transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.boxShadow = '0 0 40px rgba(249,159,27,0.55)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 0 24px rgba(249,159,27,0.35)'; }}
            >
              {submitting ? 'Submitting…' : <><Check size={15} /> Submit Profile</>}
            </button>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 10, color: '#9B9B9B', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>{label}</label>
      {children}
      {error && <div style={{ color: '#FF6B6B', fontSize: 11, marginTop: 4 }}>{error}</div>}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 10,
  padding: '12px 16px',
  color: '#F5F0E8',
  fontSize: 14,
  outline: 'none',
  transition: 'border-color 0.2s',
  cursor: 'none',
  appearance: 'none',
};
