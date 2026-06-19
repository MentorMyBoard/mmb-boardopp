import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Home } from "lucide-react";
import { useNavigate } from "react-router";
import { companies, content } from "../utils/store";
import { useSEO } from "../hooks/useSEO";
import { CustomCursor } from "../components/CustomCursor";
const WHATSAPP_URL = "https://wa.me/918655430211";

const STEPS = ["Company Info", "Contact Details", "Board Requirement", "Additional Info"];

const INDUSTRIES = ["Financial Services", "Technology", "Healthcare & Pharma", "Manufacturing", "Energy & Infrastructure", "FMCG & Retail", "Real Estate", "Education", "Media & Entertainment", "Government & PSU", "Infrastructure", "Other"];
const COMPANY_SIZES = ["Startup (1–50 employees)", "SME (51–500 employees)", "Mid-Market (501–2000 employees)", "Large Enterprise (2001–10000 employees)", "Listed Corporation (10000+ employees)"];
const REQUIREMENT_TYPES = ["Independent Director", "Advisory Board Member", "Non-Executive Director", "Committee Expert (Audit/Risk/ESG)", "ESG Board Advisor", "Governance Consultant", "Board Evaluator", "Chair/Chairman Role"];

interface FormData {
  companyName: string;
  industry: string;
  companySize: string;
  website: string;
  contactPerson: string;
  designation: string;
  email: string;
  phone: string;
  requirementTypes: string[];
  additionalDetails: string;
}

const defaultForm: FormData = {
  companyName: '', industry: '', companySize: '', website: '',
  contactPerson: '', designation: '', email: '', phone: '',
  requirementTypes: [], additionalDetails: '',
};

function SuccessCard({ assessmentUrl }: { assessmentUrl: string }) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center justify-center min-h-screen px-6"
      style={{ background: 'radial-gradient(ellipse 90% 70% at 80% 20%, rgba(25,25,112,0.5) 0%, transparent 60%), radial-gradient(ellipse 70% 50% at 20% 80%, rgba(249,159,27,0.07) 0%, transparent 60%), #08081C' }}
    >
      {/* Midnight blue ambient flare */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          style={{ position: 'absolute', top: '-15%', right: '-5%', width: '55%', height: '55%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(25,25,112,0.3) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          style={{ position: 'absolute', bottom: '-10%', left: '5%', width: '40%', height: '40%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(25,25,112,0.2) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        />
      </div>

      <div className="relative text-center max-w-lg w-full">
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
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#F99F1B', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Requirement Received ✓</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 600, color: '#F5F0E8', lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 16 }}>
            Building a Stronger Board.
          </h2>
          <p style={{ color: '#7A7A8A', fontSize: 15, lineHeight: 1.7, marginBottom: 36 }}>
            Your governance requirement has been registered. Our team will reach out within 3–5 business days with curated governance profiles.
          </p>
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

export function CompanyPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(defaultForm);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitting, setSubmitting] = useState(false);

  useSEO({
    title: "Post Board Requirement | Find Independent Directors | BoardOpp",
    description: "Post your board requirement on BoardOpp by MentorMyBoard. Find qualified independent directors, ESG advisors, audit committee chairs, and governance professionals for your corporate board. India's premier board talent platform.",
    keywords: "post board requirement India, find independent director India, board talent India, hire board member India, independent director search India, ESG board advisor India, audit committee India, governance professional India, board vacancy India, MentorMyBoard board requirement",
    canonical: "https://boardopp.mentormyboard.com/post-requirement",
    ogTitle: "Post a Board Requirement | BoardOpp",
    ogDescription: "Find India's top governance leaders for your board. Post your requirement and connect with independent directors, ESG advisors, and audit committee experts.",
    schema: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Post Board Requirement — BoardOpp",
      "description": "Post a board requirement to find qualified governance professionals on BoardOpp by MentorMyBoard",
      "url": "https://boardopp.mentormyboard.com/post-requirement",
      "isPartOf": { "@id": "https://boardopp.mentormyboard.com/#website" },
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://boardopp.mentormyboard.com" },
          { "@type": "ListItem", "position": 2, "name": "Post Board Requirement", "item": "https://boardopp.mentormyboard.com/post-requirement" }
        ]
      }
    },
  });
  const cfg = content.get();

  const update = (field: keyof FormData, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const toggleRequirement = (type: string) => {
    const cur = form.requirementTypes;
    if (cur.includes(type)) update('requirementTypes', cur.filter((t) => t !== type));
    else update('requirementTypes', [...cur, type]);
  };

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (step === 0) {
      if (!form.companyName.trim()) e.companyName = 'Required';
      if (!form.industry) e.industry = 'Select industry';
      if (!form.companySize) e.companySize = 'Select company size';
    }
    if (step === 1) {
      if (!form.contactPerson.trim()) e.contactPerson = 'Required';
      if (!form.designation.trim()) e.designation = 'Required';
      if (!form.email.match(/^[^@]+@[^@]+\.[^@]+$/)) e.email = 'Valid email required';
      if (!form.phone.match(/^\+?[\d\s\-()]{7,}$/)) e.phone = 'Valid phone required';
    }
    if (step === 2) {
      if (!form.requirementTypes.length) e.requirementTypes = ['Select at least one requirement type'];
    }
    setErrors(e as Partial<FormData>);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate()) setStep((s) => Math.min(s + 1, STEPS.length - 1)); };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const submit = async () => {
    if (!validate()) return;
    setSubmitting(true);

    const payload = {
      companyName: form.companyName, industry: form.industry, companySize: form.companySize,
      website: form.website, contactPerson: form.contactPerson, designation: form.designation,
      email: form.email, phone: form.phone,
      requirementTypes: form.requirementTypes, additionalDetails: form.additionalDetails,
    };

    // Save to localStorage for admin panel
    companies.add(payload);

    // Submit to backend (email + DB + Zoho CRM)
    try {
      await fetch('/api/company', {
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

  if (submitted) return <><CustomCursor /><SuccessCard assessmentUrl={cfg.boardAssessmentUrl} /></>;

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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full" style={{ background: 'rgba(249,159,27,0.08)', border: '1px solid rgba(249,159,27,0.2)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#F99F1B', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Company Registration</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 600, color: '#F5F0E8', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
            Build a <em style={{ color: '#F99F1B' }}>Stronger Board</em>
          </h1>
          <p style={{ color: '#7A7A8A', fontSize: 14, lineHeight: 1.65, marginTop: 12, maxWidth: 460, margin: '12px auto 0' }}>
            Register your board requirement and connect with India's top governance leaders, independent directors and advisory professionals.
          </p>
        </motion.div>

        {/* Progress */}
        <div className="flex items-center gap-3 mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-3 flex-1">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                  border: i <= step ? 'none' : '1px solid rgba(255,255,255,0.15)',
                  background: i < step ? '#F99F1B' : i === step ? '#F99F1B' : 'rgba(255,255,255,0.04)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: i === step ? '0 0 12px rgba(249,159,27,0.4)' : 'none',
                  transition: 'all 0.3s',
                }}>
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
            style={{ background: 'linear-gradient(135deg, rgba(25,25,112,0.12) 0%, rgba(255,255,255,0.03) 100%)', border: '1px solid rgba(25,25,112,0.35)', backdropFilter: 'blur(24px)' }}
          >
            {step === 0 && (
              <div className="flex flex-col gap-5">
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: '#F5F0E8', marginBottom: 4 }}>Company Information</h3>
                <CField label="Company Name *" error={errors.companyName}>
                  <input value={form.companyName} onChange={(e) => update('companyName', e.target.value)} placeholder="e.g. Apex Financial Services Ltd." style={inputStyle} />
                </CField>
                <CField label="Industry *" error={errors.industry}>
                  <select value={form.industry} onChange={(e) => update('industry', e.target.value)} style={inputStyle}>
                    <option value="">Select Industry</option>
                    {INDUSTRIES.map((ind) => <option key={ind} value={ind}>{ind}</option>)}
                  </select>
                </CField>
                <CField label="Company Size *" error={errors.companySize}>
                  <select value={form.companySize} onChange={(e) => update('companySize', e.target.value)} style={inputStyle}>
                    <option value="">Select Size</option>
                    {COMPANY_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </CField>
                <CField label="Company Website">
                  <input value={form.website} onChange={(e) => update('website', e.target.value)} placeholder="https://yourcompany.com" style={inputStyle} />
                </CField>
              </div>
            )}

            {step === 1 && (
              <div className="flex flex-col gap-5">
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: '#F5F0E8', marginBottom: 4 }}>Contact Details</h3>
                <CField label="Contact Person *" error={errors.contactPerson}>
                  <input value={form.contactPerson} onChange={(e) => update('contactPerson', e.target.value)} placeholder="Full name of primary contact" style={inputStyle} />
                </CField>
                <CField label="Designation *" error={errors.designation}>
                  <input value={form.designation} onChange={(e) => update('designation', e.target.value)} placeholder="e.g. CEO, Company Secretary, HR Director" style={inputStyle} />
                </CField>
                <CField label="Email Address *" error={errors.email}>
                  <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="contact@company.com" style={inputStyle} />
                </CField>
                <CField label="Phone Number *" error={errors.phone}>
                  <input value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+91 98765 43210" style={inputStyle} />
                </CField>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-5">
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: '#F5F0E8', marginBottom: 4 }}>Board Requirement</h3>
                <CField label="Requirement Type(s) *" error={errors.requirementTypes as unknown as string}>
                  <p style={{ color: '#5A5A6A', fontSize: 12, marginBottom: 12 }}>Select all that apply to your governance requirement.</p>
                  <div className="flex flex-col gap-2">
                    {REQUIREMENT_TYPES.map((type) => (
                      <label
                        key={type}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 10, cursor: 'none',
                          background: form.requirementTypes.includes(type) ? 'rgba(249,159,27,0.08)' : 'rgba(255,255,255,0.03)',
                          border: form.requirementTypes.includes(type) ? '1px solid rgba(249,159,27,0.3)' : '1px solid rgba(255,255,255,0.06)',
                          transition: 'all 0.2s',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={form.requirementTypes.includes(type)}
                          onChange={() => toggleRequirement(type)}
                          style={{ accentColor: '#F99F1B', cursor: 'none' }}
                        />
                        <span style={{ color: form.requirementTypes.includes(type) ? '#F5F0E8' : '#7A7A8A', fontSize: 14, transition: 'color 0.2s' }}>{type}</span>
                      </label>
                    ))}
                  </div>
                </CField>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col gap-5">
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: '#F5F0E8', marginBottom: 4 }}>Additional Information</h3>
                <CField label="Additional Requirement Details">
                  <textarea
                    value={form.additionalDetails}
                    onChange={(e) => update('additionalDetails', e.target.value)}
                    placeholder="Describe specific governance needs, industry expertise required, timeline, or any other relevant details..."
                    rows={6}
                    style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.65 }}
                  />
                </CField>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 20, marginTop: 4 }}>
                  <p style={{ color: '#5A5A6A', fontSize: 12, lineHeight: 1.6 }}>
                    Your requirement will be reviewed by MentorMyBoard's governance team. All submissions are treated with strict confidentiality.
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
              {submitting ? 'Submitting…' : <><Check size={15} /> Submit Requirement</>}
            </button>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

function CField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
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
