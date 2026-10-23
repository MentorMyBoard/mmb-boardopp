import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Award, Copy, Download, RotateCcw, Users, X, ChevronDown, Timer, Hourglass } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { CustomCursor } from "../components/CustomCursor";
import { useSEO } from "../hooks/useSEO";
import { boardroomChallenge, analytics } from "../utils/store";

// ── Game content ─────────────────────────────────────────────────────────────
type Key = 'G' | 'S' | 'W' | 'I' | 'F';
const KEYS: Key[] = ['G', 'S', 'W', 'I', 'F'];
const TOTAL_SECS = 60;
const MENTOR_URL = 'https://mentormyboard.com/mentor-browse';

const STYLES: Record<Key, { icon: string; name: string; card: string; inst: string; board: string; blind: string; part: string; who: string; quote: string }> = {
  G: { icon: '🛡️', name: 'The Guardian', card: 'guardian', inst: 'Protect what must not be compromised.', board: 'You think about people, reputation, values and long-term consequences before you think about the upside.', blind: 'You can slow down a good bet while you make it safe.', part: 'The Strategist, who keeps the growth story in view.', who: 'Indra Nooyi reminds us:', quote: 'Bring together what is good for business with what is good for the world.' },
  S: { icon: '🧭', name: 'The Strategist', card: 'strategist', inst: 'See where this decision leads.', board: 'You connect today’s question to the five-year picture and the options it opens or closes.', blind: 'You can skip past what today’s numbers are saying.', part: 'The Interrogator, who tests the evidence.', who: 'Dhirubhai Ambani reminds us:', quote: 'Think big, think fast, think ahead. Ideas are no one’s monopoly.' },
  W: { icon: '🤝', name: 'The Steward', card: 'steward', inst: 'Ask who is affected.', board: 'You keep employees, customers and communities in the room when the numbers start to dominate.', blind: 'You can delay the hard calls on people.', part: 'The Guardian, who holds the line on risk.', who: 'Jamsetji Tata reminds us:', quote: 'In a free enterprise, the community is not just another stakeholder in business but is in fact the very purpose of its existence.' },
  I: { icon: '🔎', name: 'The Interrogator', card: 'interrogator', inst: 'Question the obvious.', board: 'You challenge assumptions before accepting the answer, and you ask management to show its work.', blind: 'Your questions can land as distrust if the room doesn’t know why you ask.', part: 'The Steward, who keeps the room together.', who: 'Kiran Mazumdar-Shaw asks:', quote: 'What more can we innovate; what can we do differently?' },
  F: { icon: '⚡', name: 'The Action Leader', card: 'action-leader', inst: 'Move it forward.', board: 'You turn discussion into decisions, owners and next steps, and you bring real operating experience.', blind: 'Stepping into management’s job. On a board the rule is noses in, fingers out.', part: 'Any of the other four. A mentor helps you move from doing to governing.', who: 'Ratan Tata reminds us:', quote: 'I don’t believe in taking right decisions. I take decisions and then make them right.' },
};

interface Question { q: string; better?: string; o: Record<Key, string> }

const QS: Question[] = [
  { q: 'Revenue is growing 40%, but cash flow is collapsing. Your first question?', better: 'Where exactly is the cash getting stuck: receivables, inventory, or how we book revenue?', o: {
    G: 'Are we compliant on revenue recognition and our loan covenants?', S: 'Is this growth building the business we want in five years?', W: 'Are we squeezing suppliers or staff to show this growth?', I: 'Where is the cash stuck, and why are we hearing this only now?', F: 'Let me sit with the finance team and fix collections myself.' } },
  { q: 'The promoter wants his son appointed CEO. The board is divided. Your first question?', better: 'If he weren’t the promoter’s son, would he make our shortlist, and does our process prove it?', o: {
    G: 'Does this follow our nomination policy and the law?', S: 'Is he the leader for where the company must go next?', W: 'How will our senior leaders read this decision?', I: 'Who else was evaluated, and against what criteria?', F: 'I’ll mentor him personally for six months and then decide.' } },
  { q: 'AI recommends rejecting a major customer. Your first question?', better: 'Can anyone in this room explain why the model said no, and who is accountable if it’s wrong?', o: {
    G: 'What is our liability if the model is wrong or biased?', S: 'Does this customer fit where we are heading?', W: 'How will the customer and our relationship team be treated?', I: 'Can anyone explain why the model said no?', F: 'Send me the data and I’ll make the call.' } },
  { q: 'A star CEO delivers the numbers but is destroying the culture. Your first question?', better: 'What are attrition, exit interviews and whistleblower data telling us that the P&L isn’t?', o: {
    G: 'Are there complaints that expose us legally?', S: 'Can we deliver the next five years with this culture?', W: 'What is this doing to our people?', I: 'What do attrition and exit data actually show?', F: 'I’ll step in and run the leadership offsite.' } },
  { q: 'Ransomware has locked your systems. Attackers want ₹8 crore by midnight. Your first question?', better: 'Did we ever rehearse this, and what must regulators and customers hear from us in the next few hours?', o: {
    G: 'What must we report to regulators, and by when?', S: 'What does this change in our technology plan for the next three years?', W: 'What do we tell the customers whose data is exposed?', I: 'Did we ever rehearse this, and who signed off our backups?', F: 'Get me on a call with the IT vendor right now.' } },
];

const CASTING: Question = { q: 'Casting vote. Your answers are split evenly, so the Chair asks one more: a ₹50-crore capex proposal arrived in last night’s board papers. Your first question?', o: {
  G: 'Is this within the limits the board has already approved?', S: 'How does this fit the five-year plan?', W: 'Who does this affect on the ground?', I: 'Why are we seeing this only now, and should we defer it?', F: 'Send me the vendor quotes and I’ll review them myself.' } };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const shortName = (k: Key) => STYLES[k].name.replace('The ', '');

function shuffle<T>(a: T[]): T[] {
  const r = a.slice();
  for (let k = r.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [r[k], r[j]] = [r[j], r[k]]; }
  return r;
}

interface Result {
  top: Key;
  tied: Key[] | null;
  runnerTxt: string;
  votes: string;
  secs: number;
  overtime: boolean;
}

// ── Style card (certificate) rendering ───────────────────────────────────────
// The card artwork is 563×563; the name sits on the dotted line (x 50→298, y≈367).
const SCRIPT_FONT = 'Great Vibes';
const CARD_SIZE = 563;
const CARD_SCALE = 3;

async function renderCard(cardSlug: string, name: string): Promise<HTMLCanvasElement> {
  const img = new Image();
  img.src = `/boardroom-cards/${cardSlug}.jpg`;
  await Promise.all([img.decode(), document.fonts.load(`48px "${SCRIPT_FONT}"`).catch(() => [])]);

  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = CARD_SIZE * CARD_SCALE;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  ctx.scale(CARD_SCALE, CARD_SCALE);

  const maxWidth = 244;
  let size = 46;
  do {
    ctx.font = `${size}px "${SCRIPT_FONT}", "Brush Script MT", cursive`;
    if (ctx.measureText(name).width <= maxWidth) break;
    size -= 1;
  } while (size > 20);
  ctx.fillStyle = '#232A6E';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(name, 54, 357, maxWidth);
  return canvas;
}

// ── Page ─────────────────────────────────────────────────────────────────────
type Phase = 'intro' | 'ready' | 'quiz' | 'result';

export function BoardroomChallengePage() {
  useSEO({
    title: '60-Second Boardroom Challenge — Discover Your Boardroom Thinking Style | MentorMyBoard',
    description: 'Five real board dilemmas, one clock. Pick the first question you would ask on each and discover your Boardroom Thinking Style with MentorMyBoard.',
    keywords: 'boardroom challenge, board thinking style, independent director quiz, governance assessment, MentorMyBoard',
    canonical: 'https://boardopp.mentormyboard.com/boardroom-challenge',
  });

  // Script font for the name on the style card — only needed on this page
  useEffect(() => {
    const id = 'mmb-script-font';
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${SCRIPT_FONT.replace(/ /g, '+')}&display=swap`;
    document.head.appendChild(link);
  }, []);

  const [phase, setPhase] = useState<Phase>('intro');
  const [player, setPlayer] = useState({ name: '', email: '' });
  const [entryId, setEntryId] = useState('');
  const [form, setForm] = useState({ name: '', email: '' });
  const [formErr, setFormErr] = useState('');
  const [registering, setRegistering] = useState(false);

  const [i, setI] = useState(0);
  const [score, setScore] = useState<Record<Key, number>>({ G: 0, S: 0, W: 0, I: 0, F: 0 });
  const [picks, setPicks] = useState<Key[]>([]);
  const [casting, setCasting] = useState<Key[] | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const timer = useRef<number | undefined>(undefined);

  const [result, setResult] = useState<Result | null>(null);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [toast, setToast] = useState('');
  const [showCard, setShowCard] = useState(false);
  const [showBetter, setShowBetter] = useState(false);
  const [glow, setGlow] = useState({ x: 50, y: 50 });

  const left = Math.max(0, TOTAL_SECS - elapsed);
  const overtime = elapsed >= TOTAL_SECS;
  const low = overtime || left <= 10;

  useEffect(() => () => window.clearInterval(timer.current), []);
  useEffect(() => { window.scrollTo(0, 0); }, [phase]);

  const current: Question = casting ? CASTING : QS[i];
  const options = useMemo(() => shuffle(casting || KEYS), [i, casting]);

  const register = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = form.name.trim(), email = form.email.trim();
    if (!name) return setFormErr('Add your name to sign the register.');
    if (!EMAIL_RE.test(email)) return setFormErr('Enter a valid email, like name@company.com.');
    setFormErr('');
    setRegistering(true);
    try {
      const id = await boardroomChallenge.register(name, email);
      setEntryId(id);
      setPlayer({ name, email });
      analytics.track('assessment');
      setPhase('ready');
    } catch {
      setFormErr('We could not sign you in just now. Please check your connection and try again.');
    } finally {
      setRegistering(false);
    }
  };

  const start = () => {
    setI(0); setScore({ G: 0, S: 0, W: 0, I: 0, F: 0 }); setPicks([]); setCasting(null);
    setElapsed(0); setResult(null); setSaveState('idle'); setToast(''); setShowBetter(false);
    setPhase('quiz');
    window.clearInterval(timer.current);
    timer.current = window.setInterval(() => setElapsed((s) => s + 1), 1000);
  };

  const saveResult = (r: Result, finalPicks: Key[]) => {
    setSaveState('saving');
    boardroomChallenge.saveResult(entryId, {
      style: STYLES[r.top].name,
      runnerUp: r.runnerTxt,
      seconds: r.secs,
      overtime: r.overtime,
      castingVote: !!r.tied,
      votes: r.votes,
      picks: finalPicks.join(''),
    }).then(() => setSaveState('saved')).catch(() => setSaveState('error'));
  };

  const finish = (top: Key, finalScore: Record<Key, number>, finalPicks: Key[], tied: Key[] | null) => {
    window.clearInterval(timer.current);
    const others = KEYS.filter((k) => k !== top && finalScore[k] > 0);
    const rmax = others.length ? Math.max(...others.map((k) => Math.floor(finalScore[k]))) : 0;
    const runners = others.filter((k) => Math.floor(finalScore[k]) === rmax);
    const votes = KEYS.map((k) => [k, Math.floor(finalScore[k])] as const)
      .filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1])
      .map(([k, n]) => `${shortName(k)} ${n}`).join(' · ');
    const r: Result = {
      top, tied,
      runnerTxt: runners.length ? runners.map((k) => STYLES[k].name).join(' & ') : '',
      votes, secs: elapsed, overtime: elapsed >= TOTAL_SECS,
    };
    setResult(r);
    setPhase('result');
    saveResult(r, finalPicks);
  };

  const pick = (k: Key) => {
    if (casting) {
      const s = { ...score, [k]: score[k] + 0.5 };
      setScore(s);
      finish(k, s, picks, casting);
      return;
    }
    const s = { ...score, [k]: score[k] + 1 };
    const p = [...picks, k];
    setScore(s); setPicks(p);
    if (i + 1 < QS.length) { setI(i + 1); return; }
    // The style is only decided once all five agenda items are answered.
    const max = Math.max(...KEYS.map((x) => s[x]));
    const tied = KEYS.filter((x) => s[x] === max);
    if (tied.length > 1) setCasting(tied);
    else finish(tied[0], s, p, null);
  };

  const copyShare = () => {
    if (!result) return;
    const t = `I took the 60-Second Boardroom Challenge by MentorMyBoard. My Boardroom Thinking Style: ${STYLES[result.top].name}. There may not be one correct answer, but there is always a better question.`;
    if (navigator.clipboard) navigator.clipboard.writeText(t).then(() => setToast('Copied. Paste it on LinkedIn.')).catch(() => setToast(t));
    else setToast(t);
  };

  const changeDetails = () => {
    setEntryId(''); setPlayer({ name: '', email: '' }); setForm({ name: '', email: '' }); setPhase('intro');
  };

  const label = casting
    ? 'Casting vote · tie-breaker'
    : `${overtime ? 'Time’s up. Finish the agenda · ' : ''}Agenda item ${i + 1} of ${QS.length}`;

  return (
    <div style={{ background: '#08081C', minHeight: '100vh', cursor: 'none', overflowX: 'hidden' }}>
      <CustomCursor />
      <Navbar />

      <section
        style={{
          position: 'relative', padding: '128px 16px 96px', minHeight: '100vh',
          background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(25,25,112,0.55) 0%, rgba(25,25,112,0.12) 55%, #08081C 80%)',
        }}
      >
        {/* Ambient flares */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            style={{ position: 'absolute', top: '8%', left: '-10%', width: '45%', height: '45%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(25,25,112,0.35) 0%, transparent 70%)' }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            style={{ position: 'absolute', bottom: '0%', right: '-8%', width: '40%', height: '40%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,159,27,0.08) 0%, transparent 70%)' }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
        </div>

        <div className="relative mx-auto" style={{ maxWidth: 640 }}>
          <AnimatePresence mode="wait">
            {/* ── Intro + register ── */}
            {phase === 'intro' && (
              <motion.div key="intro" {...fade}>
                <Eyebrow>MentorMyBoard · Board Meeting No. 1</Eyebrow>
                <h1 style={{ ...h1Style, marginTop: 18 }}>
                  You have <em style={{ color: '#F99F1B' }}>60 seconds.</em> The board is waiting.
                </h1>
                <p style={{ color: '#8A8A9A', fontSize: 16, lineHeight: 1.7, marginTop: 18 }}>
                  Five agenda items. One clock. Pick the first question you would ask on each, and discover your Boardroom Thinking Style.
                </p>

                <ul style={{ listStyle: 'none', padding: 0, margin: '28px 0 32px', display: 'grid', gap: 12 }}>
                  {[
                    'Each agenda item is a real kind of board dilemma.',
                    'Choose your first instinct. There is no right answer.',
                    'The clock runs across all five. Answer every item: your style is scored only on a complete agenda.',
                  ].map((rule, n) => (
                    <motion.li
                      key={n}
                      initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + n * 0.08 }}
                      style={{ display: 'flex', gap: 14, alignItems: 'baseline', color: '#A0A0B0', fontSize: 15, lineHeight: 1.55 }}
                    >
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#F99F1B', minWidth: 22 }}>0{n + 1}</span>
                      {rule}
                    </motion.li>
                  ))}
                </ul>

                <GlassCard glow={glow} setGlow={setGlow}>
                  <form onSubmit={register} noValidate style={{ display: 'grid', gap: 16 }}>
                    <Eyebrow>Sign the board register</Eyebrow>
                    <Field label="Your name" id="bc-name" type="text" autoComplete="name" maxLength={80}
                      value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
                    <Field label="Email" id="bc-email" type="email" autoComplete="email" maxLength={120}
                      value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
                    <p aria-live="polite" style={{ color: '#FF6B6B', fontSize: 13, minHeight: 18, margin: 0 }}>{formErr}</p>
                    <PrimaryButton type="submit" disabled={registering}>
                      {registering ? 'Signing the register…' : <>Sign the register &amp; take the Chair <ArrowRight size={16} /></>}
                    </PrimaryButton>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#5A5A6A', lineHeight: 1.6, margin: 0 }}>
                      MentorMyBoard uses your name and email to send your result and occasional updates. Nothing else is collected.
                    </p>
                  </form>
                </GlassCard>
              </motion.div>
            )}

            {/* ── Ready ── */}
            {phase === 'ready' && (
              <motion.div key="ready" {...fade} style={{ display: 'grid', gap: 20, textAlign: 'center', justifyItems: 'center', paddingTop: 24 }}>
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.15, type: 'spring', stiffness: 300 }}
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{ background: '#F99F1B', boxShadow: '0 0 40px rgba(249,159,27,0.4), 0 0 80px rgba(25,25,112,0.3)' }}
                >
                  <Timer size={34} color="#0A0A0A" strokeWidth={2.2} />
                </motion.div>
                <Eyebrow>Board register · signed ✓</Eyebrow>
                <h2 style={h2Style}>You’re on the register, {player.name.split(' ')[0]}.</h2>
                <p style={{ color: '#8A8A9A', fontSize: 15, lineHeight: 1.7, maxWidth: 440 }}>
                  Take a breath. The clock starts only when you tap the button below, and it runs across all five agenda items.
                </p>
                <div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 380 }}>
                  <PrimaryButton onClick={start}>Start my 60 seconds <ArrowRight size={16} /></PrimaryButton>
                  <GhostButton onClick={changeDetails}>Not you? Change details</GhostButton>
                </div>
              </motion.div>
            )}

            {/* ── Quiz ── */}
            {phase === 'quiz' && (
              <motion.div key="quiz" {...fade} style={{ display: 'grid', gap: 22 }}>
                {/* Clock */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <motion.span
                    key={elapsed}
                    initial={{ scale: low ? 1.15 : 1 }} animate={{ scale: 1 }}
                    style={{ fontFamily: 'var(--font-mono)', fontSize: 34, fontWeight: 500, minWidth: '3.2ch', fontVariantNumeric: 'tabular-nums', color: low ? '#FF6B6B' : '#F5F0E8', transition: 'color 0.3s' }}
                  >
                    {overtime ? `+${elapsed - TOTAL_SECS}` : left}
                  </motion.span>
                  <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', transformOrigin: 'left', transform: `scaleX(${overtime ? 1 : left / TOTAL_SECS})`,
                      background: low ? '#FF6B6B' : 'linear-gradient(90deg, #F99F1B, #FFD36A)',
                      boxShadow: low ? '0 0 12px rgba(255,107,107,0.5)' : '0 0 12px rgba(249,159,27,0.5)',
                      transition: 'transform 0.25s linear, background 0.3s',
                    }} />
                  </div>
                </div>

                {/* Progress pips */}
                <div style={{ display: 'flex', gap: 6 }}>
                  {QS.map((_, n) => (
                    <div key={n} style={{ flex: 1, height: 3, borderRadius: 2, background: n < picks.length ? '#F99F1B' : n === i && !casting ? 'rgba(249,159,27,0.4)' : 'rgba(255,255,255,0.08)', transition: 'background 0.3s' }} />
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={casting ? 'casting' : i}
                    initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    style={{ display: 'grid', gap: 18 }}
                  >
                    <Eyebrow color={overtime || casting ? '#FF6B6B' : undefined}>{label}</Eyebrow>
                    <h2 style={h2Style}>{current.q}</h2>
                    <div style={{ display: 'grid', gap: 10 }}>
                      {options.map((k, n) => (
                        <OptionButton key={k} letter={String.fromCharCode(65 + n)} onClick={() => pick(k)} autoFocus={n === 0}>
                          {current.o[k]}
                        </OptionButton>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            )}

            {/* ── Result ── */}
            {phase === 'result' && result && (() => {
              const s = STYLES[result.top];
              return (
                <motion.div key="result" {...fade} style={{ display: 'grid', gap: 22 }}>
                  {result.overtime && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                      style={{ border: '1px dashed rgba(255,107,107,0.5)', background: 'rgba(255,107,107,0.05)', borderRadius: 16, padding: 20, display: 'grid', gap: 8 }}
                    >
                      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: '#FF6B6B', textTransform: 'uppercase', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Hourglass size={20} /> You ran out of time!
                      </p>
                      <p style={{ color: '#C0C0C8', fontSize: 15, margin: 0 }}>Perhaps you were looking for the perfect answer when the board needed a clear decision.</p>
                      <p style={{ color: '#C0C0C8', fontSize: 15, margin: 0 }}><b style={{ color: '#F5F0E8' }}>Boardroom lesson:</b> Clarity under pressure is also a leadership skill.</p>
                      <p style={{ color: '#A0A0B0', fontSize: 14, fontStyle: 'italic', margin: 0 }}>
                        “Arise, awake, and stop not till the goal is reached.” <span style={{ fontFamily: 'var(--font-mono)', fontStyle: 'normal', fontSize: 12, color: '#6A6A7A' }}>— Swami Vivekananda</span>
                      </p>
                    </motion.div>
                  )}

                  <div>
                    <Eyebrow>Boardroom diagnosis · evaluated on 5 of 5 items in {result.secs} seconds{result.overtime ? ' (overtime)' : ''}</Eyebrow>
                    <motion.h1
                      initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      style={{ ...h1Style, marginTop: 14, fontSize: 'clamp(2.2rem,7vw,3.4rem)' }}
                    >
                      {s.icon} You are <span style={{ background: 'linear-gradient(135deg, #F99F1B, #FFD36A)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>{s.name.replace('The ', 'the ')}</span>
                    </motion.h1>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#6A6A7A', marginTop: 12 }}>
                      Your answers: {result.votes}
                      {result.tied ? ` · tie between ${result.tied.map(shortName).join(' and ')} settled by casting vote` : ''}
                    </p>
                  </div>

                  <GlassCard glow={glow} setGlow={setGlow}>
                    <dl style={{ display: 'grid', gap: 18, margin: 0 }}>
                      <ResultRow label="Your instinct"><span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, color: '#F5F0E8' }}>{s.inst}</span></ResultRow>
                      <ResultRow label="In the boardroom">{s.board}</ResultRow>
                      <ResultRow label="Watch out for">{s.blind}</ResultRow>
                      <ResultRow label="Sit next to">{s.part}</ResultRow>
                      <ResultRow label="Runner-up style">{result.runnerTxt || 'None. Every answer pointed the same way.'}</ResultRow>
                    </dl>
                  </GlassCard>

                  <div style={{ borderLeft: '3px solid #F99F1B', paddingLeft: 18, display: 'grid', gap: 8 }}>
                    <Eyebrow>{s.who}</Eyebrow>
                    <blockquote style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 21, lineHeight: 1.35, color: '#F5F0E8', fontWeight: 500 }}>“{s.quote}”</blockquote>
                  </div>

                  {/* Step 1 · style card */}
                  <motion.div
                    animate={{ boxShadow: ['0 0 20px rgba(249,159,27,0.08)', '0 0 40px rgba(249,159,27,0.2)', '0 0 20px rgba(249,159,27,0.08)'] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    style={{ border: '1px solid rgba(249,159,27,0.35)', background: 'linear-gradient(135deg, rgba(249,159,27,0.08), rgba(25,25,112,0.15))', borderRadius: 18, padding: 22, display: 'grid', gap: 12 }}
                  >
                    <Eyebrow>Step 1 · Enter it in the minutes</Eyebrow>
                    <PrimaryButton onClick={() => setShowCard(true)}><Award size={17} /> Record my result &amp; claim my style card</PrimaryButton>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#7A7A8A', margin: 0, lineHeight: 1.6 }}>
                      {saveState === 'error' ? (
                        <>We couldn’t record your result. <button onClick={() => saveResult(result, picks)} style={{ background: 'none', border: 'none', color: '#F99F1B', textDecoration: 'underline', cursor: 'none', font: 'inherit', padding: 0 }}>Try again</button></>
                      ) : saveState === 'saving' ? 'Recording your result in the minutes…'
                        : 'Your result is recorded. Download your personalised style card and show it at the MentorMyBoard stall.'}
                    </p>
                  </motion.div>

                  <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, lineHeight: 1.35, color: '#C0C0C8', fontStyle: 'italic', margin: 0 }}>
                    There may not be one correct answer. But there is always a better question.
                  </p>

                  {/* Better questions */}
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 14 }}>
                    <button
                      onClick={() => setShowBetter((v) => !v)}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', background: 'none', border: 'none', color: '#F5F0E8', fontSize: 15, fontWeight: 600, cursor: 'none', padding: '6px 0', textAlign: 'left' }}
                    >
                      See the better question for each agenda item
                      <motion.span animate={{ rotate: showBetter ? 180 : 0 }}><ChevronDown size={18} color="#F99F1B" /></motion.span>
                    </button>
                    <AnimatePresence>
                      {showBetter && (
                        <motion.ol
                          initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                          style={{ overflow: 'hidden', paddingLeft: 20, margin: '12px 0 0', display: 'grid', gap: 12, color: '#8A8A9A', fontSize: 14, lineHeight: 1.6 }}
                        >
                          {QS.map((q, n) => (
                            <li key={n}><b style={{ color: '#E0E0E8', fontWeight: 600 }}>{q.q}</b><br />{q.better}</li>
                          ))}
                        </motion.ol>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Step 2 */}
                  <div style={{ display: 'grid', gap: 12 }}>
                    <Eyebrow>Step 2 · Sharpen your style</Eyebrow>
                    <GhostButton href={MENTOR_URL}><Users size={16} /> Find a board mentor who complements you</GhostButton>
                    <GhostButton onClick={copyShare}><Copy size={16} /> Copy my result to share</GhostButton>
                    <p aria-live="polite" style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#F99F1B', minHeight: 16, margin: 0 }}>{toast}</p>
                    <GhostButton onClick={start}><RotateCcw size={16} /> Play again</GhostButton>
                  </div>
                </motion.div>
              );
            })()}
          </AnimatePresence>
        </div>
      </section>

      <Footer />

      <AnimatePresence>
        {showCard && result && (
          <StyleCardModal
            name={player.name}
            cardSlug={result.overtime ? 'overtime' : STYLES[result.top].card}
            styleName={result.overtime ? 'Ran Out of Time' : STYLES[result.top].name}
            onClose={() => setShowCard(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Style card modal ─────────────────────────────────────────────────────────
function StyleCardModal({ name, cardSlug, styleName, onClose }: { name: string; cardSlug: string; styleName: string; onClose: () => void }) {
  const [src, setSrc] = useState('');
  const [failed, setFailed] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let alive = true;
    renderCard(cardSlug, name)
      .then((c) => { if (alive) { canvasRef.current = c; setSrc(c.toDataURL('image/png')); } })
      .catch(() => alive && setFailed(true));
    return () => { alive = false; };
  }, [cardSlug, name]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const download = () => {
    canvasRef.current?.toBlob((blob) => {
      if (!blob) return;
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      a.download = `MentorMyBoard-${slug(styleName)}-${slug(name) || 'card'}.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    }, 'image/png');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(8,8,28,0.88)', backdropFilter: 'blur(8px)', zIndex: 2000, overflowY: 'auto', padding: '32px 16px 48px', cursor: 'none' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.96 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        role="dialog" aria-modal="true" aria-label="Your boardroom style card"
        style={{ maxWidth: 520, margin: '0 auto', display: 'grid', gap: 18 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Eyebrow>Your style card · {styleName}</Eyebrow>
          <button onClick={onClose} aria-label="Close" style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#C0C0C8', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'none' }}>
            <X size={16} />
          </button>
        </div>

        <motion.div
          animate={{ y: [0, -6, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ borderRadius: 16, overflow: 'hidden', aspectRatio: '1 / 1', background: '#FFFFFF', boxShadow: '0 0 60px rgba(25,25,112,0.35), 0 0 30px rgba(249,159,27,0.15), 0 40px 100px rgba(0,0,0,0.5)' }}
        >
          {src ? (
            <img src={src} alt={`${styleName} style card for ${name}`} style={{ width: '100%', height: '100%', display: 'block' }} />
          ) : (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6A6A88', fontSize: 14 }}>
              {failed ? 'We couldn’t prepare your card. Please close and try again.' : 'Preparing your card…'}
            </div>
          )}
        </motion.div>

        <PrimaryButton onClick={download} disabled={!src}><Download size={17} /> Download my style card</PrimaryButton>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#7A7A8A', textAlign: 'center', margin: 0, lineHeight: 1.6 }}>
          Saved as a PNG image. Share it on LinkedIn or show it at the MentorMyBoard stall.
        </p>
      </motion.div>
    </motion.div>
  );
}

// ── Building blocks ──────────────────────────────────────────────────────────
const fade = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
};

const h1Style: React.CSSProperties = { fontFamily: 'var(--font-display)', fontSize: 'clamp(2.1rem,6.5vw,3.4rem)', fontWeight: 600, color: '#F5F0E8', lineHeight: 1.1, letterSpacing: '-0.02em', margin: 0, textWrap: 'balance' as any };
const h2Style: React.CSSProperties = { fontFamily: 'var(--font-display)', fontSize: 'clamp(1.45rem,4.5vw,1.9rem)', fontWeight: 600, color: '#F5F0E8', lineHeight: 1.22, letterSpacing: '-0.015em', margin: 0, textWrap: 'balance' as any };

function Eyebrow({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: color || '#F99F1B', letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0, lineHeight: 1.5 }}>
      {children}
    </p>
  );
}

function GlassCard({ children, glow, setGlow }: { children: React.ReactNode; glow: { x: number; y: number }; setGlow: (g: { x: number; y: number }) => void }) {
  return (
    <div
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setGlow({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
      }}
      className="relative rounded-2xl overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', boxShadow: '0 8px 32px rgba(0,0,0,0.25)', padding: 24 }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(circle at ${glow.x}% ${glow.y}%, rgba(249,159,27,0.08), transparent 55%)` }} />
      <div className="relative">{children}</div>
    </div>
  );
}

function Field({ label, id, value, onChange, ...rest }: { label: string; id: string; value: string; onChange: (v: string) => void } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'>) {
  const [focus, setFocus] = useState(false);
  return (
    <label htmlFor={id} style={{ display: 'grid', gap: 7, color: '#C0C0C8', fontSize: 13, fontWeight: 500 }}>
      {label}
      <input
        id={id} value={value} required {...rest}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{
          width: '100%', boxSizing: 'border-box', padding: '13px 14px', borderRadius: 10, fontSize: 16, color: '#F5F0E8', outline: 'none', cursor: 'none',
          background: 'rgba(255,255,255,0.05)', border: `1px solid ${focus ? 'rgba(249,159,27,0.5)' : 'rgba(255,255,255,0.1)'}`,
          boxShadow: focus ? '0 0 0 3px rgba(249,159,27,0.12)' : 'none', transition: 'all 0.2s',
        }}
      />
    </label>
  );
}

function PrimaryButton({ children, onClick, type = 'button', disabled }: { children: React.ReactNode; onClick?: () => void; type?: 'button' | 'submit'; disabled?: boolean }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type={type} onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        background: 'linear-gradient(135deg, #F99F1B, #FFD36A)', color: '#0A0A0A', fontSize: 15, fontWeight: 700,
        padding: '16px 22px', borderRadius: 11, border: 'none', cursor: 'none', opacity: disabled ? 0.6 : 1,
        boxShadow: hover && !disabled ? '0 12px 36px rgba(249,159,27,0.45)' : '0 0 20px rgba(249,159,27,0.25)',
        transform: hover && !disabled ? 'translateY(-2px)' : 'translateY(0)', transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      {children}
    </button>
  );
}

function GhostButton({ children, onClick, href }: { children: React.ReactNode; onClick?: () => void; href?: string }) {
  const [hover, setHover] = useState(false);
  const style: React.CSSProperties = {
    width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxSizing: 'border-box',
    background: hover ? 'rgba(249,159,27,0.08)' : 'rgba(255,255,255,0.03)', color: hover ? '#F99F1B' : '#E0E0E8',
    border: `1px solid ${hover ? 'rgba(249,159,27,0.35)' : 'rgba(255,255,255,0.1)'}`, fontSize: 14, fontWeight: 600,
    padding: '14px 20px', borderRadius: 11, cursor: 'none', textDecoration: 'none', transition: 'all 0.25s',
  };
  const events = { onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false) };
  if (href) return <a href={href} target="_blank" rel="noopener noreferrer" style={style} {...events}>{children}</a>;
  return <button type="button" onClick={onClick} style={style} {...events}>{children}</button>;
}

function OptionButton({ children, letter, onClick, autoFocus }: { children: React.ReactNode; letter: string; onClick: () => void; autoFocus?: boolean }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button" onClick={onClick} autoFocus={autoFocus}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)} onBlur={() => setHover(false)}
      style={{
        display: 'flex', gap: 14, alignItems: 'flex-start', textAlign: 'left', width: '100%', outline: 'none',
        background: hover ? 'rgba(249,159,27,0.07)' : 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)',
        border: `1px solid ${hover ? 'rgba(249,159,27,0.4)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 12,
        padding: '15px 16px', color: '#E8E8EE', fontSize: 15, lineHeight: 1.45, cursor: 'none',
        transform: hover ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hover ? '0 12px 32px rgba(249,159,27,0.12)' : '0 4px 16px rgba(0,0,0,0.15)',
        transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      <span style={{
        flexShrink: 0, width: 26, height: 26, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 500,
        background: hover ? '#F99F1B' : 'rgba(249,159,27,0.1)', color: hover ? '#0A0A0A' : '#F99F1B',
        border: '1px solid rgba(249,159,27,0.25)', transition: 'all 0.3s',
      }}>{letter}</span>
      <span>{children}</span>
    </button>
  );
}

function ResultRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#6A6A7A', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{label}</dt>
      <dd style={{ margin: '6px 0 0', color: '#B0B0BE', fontSize: 15, lineHeight: 1.6 }}>{children}</dd>
    </div>
  );
}
