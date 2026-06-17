// localStorage-based data layer for BoardOpp admin and public forms

export interface DirectorLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  industry: string;
  experience: string;
  boardExperience: string;
  linkedin: string;
  expertise: string;
  preferredRole: string;
  location: string;
  resumeName?: string;
  submittedAt: string;
}

export interface CompanyLead {
  id: string;
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
  submittedAt: string;
}

export interface Assessment {
  id: string;
  name: string;
  description: string;
  buttonText: string;
  url: string;
  icon: string;
  order: number;
  active: boolean;
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
  website: string;
  order: number;
  active: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  designation: string;
  organization: string;
  photo: string;
  text: string;
  videoLink?: string;
  order: number;
  active: boolean;
}

export interface CommunityMember {
  id: string;
  name: string;
  photo: string;
  designation: string;
  industry: string;
  experience: string;
  expertise: string[];
  badges: string[];
  linkedin: string;
  order: number;
  active: boolean;
}

export interface SiteContent {
  heroTitle: string;
  heroSubtitle: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  aboutTitle: string;
  aboutBody: string;
  trustNumbers: { label: string; value: string; sub: string }[];
  footerTagline: string;
  contactEmail: string;
  contactPhone: string;
  assessmentCardUrl: string;
  boardAssessmentUrl: string;
}

export interface AnalyticsEntry {
  date: string;
  pageViews: number;
  uniqueVisitors: number;
  directorForms: number;
  companyForms: number;
  assessmentClicks: number;
}

// --- Helpers ---
function uid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function getItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// --- Directors ---
export const directors = {
  getAll: (): DirectorLead[] => getItem<DirectorLead[]>('bo_directors', []),
  add: (data: Omit<DirectorLead, 'id' | 'submittedAt'>): DirectorLead => {
    const record: DirectorLead = { ...data, id: uid(), submittedAt: new Date().toISOString() };
    const list = directors.getAll();
    list.unshift(record);
    setItem('bo_directors', list);
    analytics.track('director');
    return record;
  },
  update: (id: string, data: Partial<DirectorLead>): void => {
    const list = directors.getAll().map((d) => (d.id === id ? { ...d, ...data } : d));
    setItem('bo_directors', list);
  },
  remove: (id: string): void => {
    setItem('bo_directors', directors.getAll().filter((d) => d.id !== id));
  },
};

// --- Live leads (from the real server database, not localStorage) ---
const ADMIN_API_TOKEN = 'boardopp-admin-2024-secure';

function mapDirectorRow(r: any): DirectorLead {
  return {
    id: r.id, name: r.name, email: r.email, phone: r.phone,
    designation: r.designation, industry: r.industry, experience: r.experience,
    boardExperience: r.board_experience, linkedin: r.linkedin,
    expertise: Array.isArray(r.expertise) ? r.expertise.join(', ') : (r.expertise || ''),
    preferredRole: r.preferred_role, location: r.location,
    resumeName: r.resume_name, submittedAt: r.submitted_at,
  };
}

function mapCompanyRow(r: any): CompanyLead {
  return {
    id: r.id, companyName: r.company_name, industry: r.industry,
    companySize: r.company_size, website: r.website, contactPerson: r.contact_person,
    designation: r.designation, email: r.email, phone: r.phone,
    requirementTypes: r.requirementTypes || [], additionalDetails: r.additional_details,
    submittedAt: r.submitted_at,
  };
}

export async function fetchDirectorLeads(): Promise<DirectorLead[]> {
  const res = await fetch('/api/admin/directors', { headers: { 'x-admin-token': ADMIN_API_TOKEN } });
  if (!res.ok) throw new Error('Failed to fetch director leads');
  const { data } = await res.json();
  return data.map(mapDirectorRow);
}

export async function fetchCompanyLeads(): Promise<CompanyLead[]> {
  const res = await fetch('/api/admin/companies', { headers: { 'x-admin-token': ADMIN_API_TOKEN } });
  if (!res.ok) throw new Error('Failed to fetch company leads');
  const { data } = await res.json();
  return data.map(mapCompanyRow);
}

export async function deleteDirectorLead(id: string): Promise<void> {
  await fetch(`/api/admin/directors/${id}`, { method: 'DELETE', headers: { 'x-admin-token': ADMIN_API_TOKEN } });
}

export async function deleteCompanyLead(id: string): Promise<void> {
  await fetch(`/api/admin/companies/${id}`, { method: 'DELETE', headers: { 'x-admin-token': ADMIN_API_TOKEN } });
}

// --- Companies ---
export const companies = {
  getAll: (): CompanyLead[] => getItem<CompanyLead[]>('bo_companies', []),
  add: (data: Omit<CompanyLead, 'id' | 'submittedAt'>): CompanyLead => {
    const record: CompanyLead = { ...data, id: uid(), submittedAt: new Date().toISOString() };
    const list = companies.getAll();
    list.unshift(record);
    setItem('bo_companies', list);
    analytics.track('company');
    return record;
  },
  update: (id: string, data: Partial<CompanyLead>): void => {
    const list = companies.getAll().map((c) => (c.id === id ? { ...c, ...data } : c));
    setItem('bo_companies', list);
  },
  remove: (id: string): void => {
    setItem('bo_companies', companies.getAll().filter((c) => c.id !== id));
  },
};

// --- Assessments ---
const defaultAssessments: Assessment[] = [
  { id: 'a1', name: 'Director Readiness Assessment', description: 'Discover your readiness to serve on a corporate board', buttonText: 'Take Assessment', url: '#', icon: '🏛', order: 1, active: true },
  { id: 'a2', name: 'Board Effectiveness Review', description: 'Benchmark your board against global governance standards', buttonText: 'Begin Review', url: '#', icon: '📊', order: 2, active: true },
  { id: 'a3', name: 'ESG Governance Maturity', description: 'Assess your organization\'s ESG governance readiness', buttonText: 'Assess Now', url: '#', icon: '🌿', order: 3, active: true },
  { id: 'a4', name: 'Audit Committee Readiness', description: 'Evaluate your preparedness for audit committee leadership', buttonText: 'Start Assessment', url: '#', icon: '⚖', order: 4, active: true },
];

export const assessments = {
  getAll: (): Assessment[] => getItem<Assessment[]>('bo_assessments', defaultAssessments),
  getActive: (): Assessment[] => assessments.getAll().filter((a) => a.active).sort((a, b) => a.order - b.order),
  add: (data: Omit<Assessment, 'id'>): Assessment => {
    const record: Assessment = { ...data, id: uid() };
    const list = assessments.getAll();
    list.push(record);
    setItem('bo_assessments', list);
    return record;
  },
  update: (id: string, data: Partial<Assessment>): void => {
    const list = assessments.getAll().map((a) => (a.id === id ? { ...a, ...data } : a));
    setItem('bo_assessments', list);
  },
  remove: (id: string): void => {
    setItem('bo_assessments', assessments.getAll().filter((a) => a.id !== id));
  },
};

// --- Partners ---
const defaultPartners: Partner[] = [
  { id: 'p1', name: 'I-Spark', logo: '/partners/i-spark.jpg', website: '#', order: 1, active: true },
  { id: 'p2', name: 'PROCS', logo: '/partners/procs.jpg', website: '#', order: 2, active: true },
  { id: 'p3', name: 'Pantomath', logo: '/partners/pantomath.jpg', website: '#', order: 3, active: true },
  { id: 'p4', name: 'Pillai', logo: '/partners/pillai.jpg', website: '#', order: 4, active: true },
  { id: 'p5', name: 'Share India', logo: '/partners/share-india.jpg', website: '#', order: 5, active: true },
  { id: 'p6', name: 'RTP', logo: '/partners/rtp.jpg', website: '#', order: 6, active: true },
  { id: 'p7', name: 'Equations', logo: '/partners/equations.jpg', website: '#', order: 7, active: true },
  { id: 'p8', name: 'Sepentia', logo: '/partners/sepentia.jpg', website: '#', order: 8, active: true },
  { id: 'p9', name: 'BA', logo: '/partners/ba.jpg', website: '#', order: 9, active: true },
  { id: 'p10', name: 'Relligio', logo: '/partners/relligio.jpg', website: '#', order: 10, active: true },
  { id: 'p11', name: 'Optimist', logo: '/partners/optimist.jpg', website: '#', order: 11, active: true },
  { id: 'p12', name: 'Mentor', logo: '/partners/mentor.jpg', website: '#', order: 12, active: true },
  { id: 'p13', name: 'ILA', logo: '/partners/ila.jpg', website: '#', order: 13, active: true },
  { id: 'p14', name: 'Zenesse', logo: '/partners/zenesse.jpg', website: '#', order: 14, active: true },
  { id: 'p15', name: 'Impact', logo: '/partners/impact.jpg', website: '#', order: 15, active: true },
  { id: 'p16', name: 'Shunya', logo: '/partners/shunya.jpg', website: '#', order: 16, active: true },
  { id: 'p17', name: 'P4G', logo: '/partners/p4g.jpg', website: '#', order: 17, active: true },
  { id: 'p18', name: 'Samsara', logo: '/partners/samsara.jpg', website: '#', order: 18, active: true },
  { id: 'p19', name: 'Amazin', logo: '/partners/amazin.jpg', website: '#', order: 19, active: true },
  { id: 'p20', name: 'TerraPledge', logo: '/partners/terrapledge.jpg', website: '#', order: 20, active: true },
  { id: 'p21', name: 'Legal', logo: '/partners/legal.jpg', website: '#', order: 21, active: true },
  { id: 'p22', name: 'Ouriken', logo: '/partners/ouriken.jpg', website: '#', order: 22, active: true },
  { id: 'p23', name: 'Rhyyns', logo: '/partners/rhyyns.jpg', website: '#', order: 23, active: true },
  { id: 'p24', name: 'Cloud', logo: '/partners/cloud.jpg', website: '#', order: 24, active: true },
  { id: 'p25', name: 'ESG', logo: '/partners/esg.jpg', website: '#', order: 25, active: true },
  { id: 'p26', name: 'Prudent', logo: '/partners/prudent.jpg', website: '#', order: 26, active: true },
  { id: 'p27', name: 'MG', logo: '/partners/mg.jpg', website: '#', order: 27, active: true },
  { id: 'p28', name: 'Mentor Finance', logo: '/partners/mentor-finance.jpg', website: '#', order: 28, active: true },
];

export const partners = {
  getAll: (): Partner[] => getItem<Partner[]>('bo_partners', defaultPartners),
  getActive: (): Partner[] => partners.getAll().filter((p) => p.active).sort((a, b) => a.order - b.order),
  add: (data: Omit<Partner, 'id'>): Partner => {
    const record: Partner = { ...data, id: uid() };
    const list = partners.getAll();
    list.push(record);
    setItem('bo_partners', list);
    return record;
  },
  update: (id: string, data: Partial<Partner>): void => {
    const list = partners.getAll().map((p) => (p.id === id ? { ...p, ...data } : p));
    setItem('bo_partners', list);
  },
  remove: (id: string): void => {
    setItem('bo_partners', partners.getAll().filter((p) => p.id !== id));
  },
};

// --- Testimonials ---
const defaultTestimonials: Testimonial[] = [
  { id: 't1', name: 'Deepak Srivastava', designation: 'Independent Director', organization: 'Vedanta Resources & ONGC Boards', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&auto=format', text: 'BoardOpp is not a platform — it is a governance movement. It has fundamentally changed how India\'s most accomplished professionals think about board service.', order: 1, active: true },
  { id: 't2', name: 'Ananya Krishnaswamy', designation: 'Chief Governance Officer', organization: 'Infosys BPM', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop&auto=format', text: 'We found our entire audit committee through BoardOpp in record time. The quality of professionals on this platform is unmatched. A true governance ecosystem.', order: 2, active: true },
  { id: 't3', name: 'Rajan Pillai', designation: 'Former CMD', organization: 'State Bank of India', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format', text: 'The Director Readiness Assessment gave me a clear-eyed view of where I stood and what I needed to develop before taking on an independent director role. Invaluable.', order: 3, active: true },
];

export const testimonials = {
  getAll: (): Testimonial[] => getItem<Testimonial[]>('bo_testimonials', defaultTestimonials),
  getActive: (): Testimonial[] => testimonials.getAll().filter((t) => t.active).sort((a, b) => a.order - b.order),
  add: (data: Omit<Testimonial, 'id'>): Testimonial => {
    const record: Testimonial = { ...data, id: uid() };
    const list = testimonials.getAll();
    list.push(record);
    setItem('bo_testimonials', list);
    return record;
  },
  update: (id: string, data: Partial<Testimonial>): void => {
    const list = testimonials.getAll().map((t) => (t.id === id ? { ...t, ...data } : t));
    setItem('bo_testimonials', list);
  },
  remove: (id: string): void => {
    setItem('bo_testimonials', testimonials.getAll().filter((t) => t.id !== id));
  },
};

// --- Community Members ---
const defaultCommunity: CommunityMember[] = [
  { id: 'c1', name: 'Namrata Thakkar', photo: '/board-placement/namrata-thakkar.png', designation: 'Independent Director at Arihant Superstructures Ltd.', industry: 'Real Estate', experience: '', expertise: ['Corporate Governance', 'Real Estate', 'Board Affairs'], badges: ['Independent Director'], linkedin: '#', order: 1, active: true },
  { id: 'c2', name: 'Nalina Suresh', photo: '/board-placement/nalina-suresh.png', designation: 'Independent Director, Founder – Stratus Talent', industry: 'HR & Talent', experience: '', expertise: ['Talent Strategy', 'Corporate Governance', 'Leadership'], badges: ['Independent Director'], linkedin: '#', order: 2, active: true },
  { id: 'c3', name: 'Ranjeeta Sahoo', photo: '/board-placement/ranjeeta-saahu.png', designation: 'Independent Director, Principal – Abode School', industry: 'Education', experience: '', expertise: ['Education', 'Corporate Governance', 'Stakeholder Management'], badges: ['Independent Director'], linkedin: '#', order: 3, active: true },
  { id: 'c4', name: 'Sonal Doshi', photo: '/board-placement/sonal-doshi.png', designation: 'Independent Director at MCON Rasayan India Ltd.', industry: 'Manufacturing', experience: '', expertise: ['Corporate Governance', 'Manufacturing', 'Compliance'], badges: ['Independent Director'], linkedin: '#', order: 4, active: true },
  { id: 'c5', name: 'Dilip Jain', photo: '/board-placement/dilip-jain.png', designation: 'Independent Director at MCON Rasayan India Ltd.', industry: 'Manufacturing', experience: '', expertise: ['Corporate Governance', 'Finance', 'Risk Management'], badges: ['Independent Director'], linkedin: '#', order: 5, active: true },
  { id: 'c6', name: 'Shilpa Bhatia', photo: '/board-placement/shilpa-bhatia.png', designation: 'Independent Director at Coastal Marine Construction & Engineering Ltd.', industry: 'Infrastructure', experience: '', expertise: ['Corporate Governance', 'Infrastructure', 'Legal'], badges: ['Independent Director'], linkedin: '#', order: 6, active: true },
  { id: 'c7', name: 'Rear Admiral Sanjay Roye', photo: '/board-placement/rear-admiral-sanjay-roye.png', designation: 'Independent Director, Sacheerome Ltd.', industry: 'Infrastructure', experience: '', expertise: ['Strategic Leadership', 'Defence', 'Corporate Governance'], badges: ['Independent Director'], linkedin: '#', order: 7, active: true },
  { id: 'c8', name: 'Capt Tapas Majumdar', photo: '/board-placement/capt-tapas-majumdar.png', designation: 'Independent Director at MCON Rasayan India Ltd.', industry: 'Manufacturing', experience: '', expertise: ['Corporate Governance', 'Operations', 'Strategy'], badges: ['Independent Director'], linkedin: '#', order: 8, active: true },
  { id: 'c9', name: 'Jayanthi Talluri', photo: '/board-placement/jayanthi-talluri.png', designation: 'Independent Director at Refex Renewables & Infrastructure Ltd.', industry: 'Energy & Infrastructure', experience: '', expertise: ['Corporate Governance', 'Renewables', 'ESG'], badges: ['Independent Director'], linkedin: '#', order: 9, active: true },
  { id: 'c10', name: 'Sandeep Budhrani', photo: '/board-placement/sandeep-budhrani.png', designation: 'Independent Director at Dinesh Engineers Ltd.', industry: 'Engineering', experience: '', expertise: ['Corporate Governance', 'Engineering', 'Operations'], badges: ['Independent Director'], linkedin: '#', order: 10, active: true },
  { id: 'c11', name: 'Vikas Sethia', photo: '/board-placement/vikas-sethia.png', designation: 'Independent Director at Capital Numbers Ltd.', industry: 'Technology', experience: '', expertise: ['Corporate Governance', 'Technology', 'Digital Strategy'], badges: ['Independent Director'], linkedin: '#', order: 11, active: true },
  { id: 'c12', name: 'C.N. Murthy', photo: '/board-placement/c-n-murthy.png', designation: 'Independent Director at Manika Plastech Ltd.', industry: 'Manufacturing', experience: '', expertise: ['Corporate Governance', 'Manufacturing', 'Strategy'], badges: ['Independent Director'], linkedin: '#', order: 12, active: true },
  { id: 'c13', name: 'Nilesh Vikamsey', photo: '/board-placement/nIlesh-vikamsey.png', designation: 'Advisory Board Member at IFA Global', industry: 'Financial Services', experience: '', expertise: ['Finance', 'Advisory', 'Capital Markets'], badges: ['Advisory Board Member'], linkedin: '#', order: 13, active: true },
  { id: 'c14', name: 'Ruchi Agnihotri', photo: '/board-placement/ruchi-agnihotri.png', designation: 'Independent Director at Renny Strips Pvt. Ltd.', industry: 'Manufacturing', experience: '', expertise: ['Corporate Governance', 'Manufacturing', 'Compliance'], badges: ['Independent Director'], linkedin: '#', order: 14, active: true },
  { id: 'c15', name: 'Sunil Suri', photo: '/board-placement/sunil-suri.png', designation: 'Independent Director at Renny Strips Pvt. Ltd.', industry: 'Manufacturing', experience: '', expertise: ['Corporate Governance', 'Risk Management', 'Finance'], badges: ['Independent Director'], linkedin: '#', order: 15, active: true },
  { id: 'c16', name: 'Sanjay Israni', photo: '/board-placement/sanjay-israni.png', designation: 'Independent Director at Manika Plastech Ltd.', industry: 'Manufacturing', experience: '', expertise: ['Corporate Governance', 'Manufacturing', 'Operations'], badges: ['Independent Director'], linkedin: '#', order: 16, active: true },
  { id: 'c17', name: 'Mihir Nanavati', photo: '/board-placement/mihir-nanavati.png', designation: 'Advisory Board Member at IFA Global', industry: 'Financial Services', experience: '', expertise: ['Finance', 'Advisory', 'Investment Strategy'], badges: ['Advisory Board Member'], linkedin: '#', order: 17, active: true },
  { id: 'c18', name: 'Sharayu Sawant', photo: '/board-placement/sharayu-sawant.png', designation: 'Independent Director at Coastal Marine Construction & Engineering Ltd.', industry: 'Infrastructure', experience: '', expertise: ['Corporate Governance', 'Infrastructure', 'Legal'], badges: ['Independent Director'], linkedin: '#', order: 18, active: true },
  { id: 'c19', name: 'Maxson Lewis', photo: '/board-placement/maxson-lewis.png', designation: 'Non Exec-Independent Director at Advance Cable Technologies Pvt. Ltd.', industry: 'Technology', experience: '', expertise: ['Corporate Governance', 'Technology', 'Manufacturing'], badges: ['Non-Executive Director'], linkedin: '#', order: 19, active: true },
  { id: 'c20', name: 'Captain K. Srinivas', photo: '/board-placement/captain-k-srinivas.png', designation: 'Non Exec-Independent Director at Advance Cable Technologies Pvt. Ltd.', industry: 'Technology', experience: '', expertise: ['Corporate Governance', 'Strategic Leadership', 'Operations'], badges: ['Non-Executive Director'], linkedin: '#', order: 20, active: true },
];

export const community = {
  getAll: (): CommunityMember[] => getItem<CommunityMember[]>('bo_community', defaultCommunity),
  getActive: (): CommunityMember[] => community.getAll().filter((m) => m.active).sort((a, b) => a.order - b.order),
  add: (data: Omit<CommunityMember, 'id'>): CommunityMember => {
    const record: CommunityMember = { ...data, id: uid() };
    const list = community.getAll();
    list.push(record);
    setItem('bo_community', list);
    return record;
  },
  update: (id: string, data: Partial<CommunityMember>): void => {
    const list = community.getAll().map((m) => (m.id === id ? { ...m, ...data } : m));
    setItem('bo_community', list);
  },
  remove: (id: string): void => {
    setItem('bo_community', community.getAll().filter((m) => m.id !== id));
  },
};

// --- Site Content ---
const defaultContent: SiteContent = {
  heroTitle: 'The Future of Board Opportunities Starts Here.',
  heroSubtitle: 'Connecting visionary organizations with governance leaders while helping professionals prepare for meaningful boardroom roles.',
  heroCtaPrimary: 'Post a Board Requirement',
  heroCtaSecondary: 'Join the Boardroom',
  aboutTitle: 'BoardOpp is MentorMyBoard\'s governance ecosystem',
  aboutBody: 'Where directors express interest in board opportunities, companies express governance requirements, and both can assess their readiness.',
  trustNumbers: [
    { label: 'Organizations Served', value: '500+', sub: 'Across 18 industries' },
    { label: 'Governance Professionals', value: '2000+', sub: 'In our network' },
    { label: 'Programs Conducted', value: '150+', sub: 'By MentorMyBoard' },
    { label: 'Board Opportunities', value: '1200+', sub: 'Facilitated to date' },
  ],
  footerTagline: 'Transforming governance leadership across India.',
  contactEmail: 'hello@mentormyboard.com',
  contactPhone: '+91 98765 43210',
  assessmentCardUrl: '#',
  boardAssessmentUrl: '#',
};

export const content = {
  get: (): SiteContent => getItem<SiteContent>('bo_content', defaultContent),
  update: (data: Partial<SiteContent>): void => {
    setItem('bo_content', { ...content.get(), ...data });
  },
  reset: (): void => {
    setItem('bo_content', defaultContent);
  },
};

// --- Analytics ---
export const analytics = {
  track: (type: 'pageView' | 'director' | 'company' | 'assessment'): void => {
    const today = new Date().toISOString().split('T')[0];
    const log = getItem<AnalyticsEntry[]>('bo_analytics', []);
    const idx = log.findIndex((e) => e.date === today);
    if (idx >= 0) {
      if (type === 'pageView') { log[idx].pageViews++; log[idx].uniqueVisitors++; }
      if (type === 'director') log[idx].directorForms++;
      if (type === 'company') log[idx].companyForms++;
      if (type === 'assessment') log[idx].assessmentClicks++;
    } else {
      log.push({
        date: today,
        pageViews: type === 'pageView' ? 1 : 0,
        uniqueVisitors: type === 'pageView' ? 1 : 0,
        directorForms: type === 'director' ? 1 : 0,
        companyForms: type === 'company' ? 1 : 0,
        assessmentClicks: type === 'assessment' ? 1 : 0,
      });
    }
    setItem('bo_analytics', log.slice(-30));
  },
  getLast30Days: (): AnalyticsEntry[] => {
    const log = getItem<AnalyticsEntry[]>('bo_analytics', []);
    // Fill in missing days with zeros for the past 14 days
    const result: AnalyticsEntry[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const found = log.find((e) => e.date === dateStr);
      result.push(found || { date: dateStr, pageViews: 0, uniqueVisitors: 0, directorForms: 0, companyForms: 0, assessmentClicks: 0 });
    }
    return result;
  },
  getTotals: () => {
    const log = getItem<AnalyticsEntry[]>('bo_analytics', []);
    return {
      totalDirectors: directors.getAll().length,
      totalCompanies: companies.getAll().length,
      totalPageViews: log.reduce((s, e) => s + e.pageViews, 0),
      totalUniqueVisitors: log.reduce((s, e) => s + e.uniqueVisitors, 0),
      totalAssessmentClicks: log.reduce((s, e) => s + e.assessmentClicks, 0),
      recentDirectors: directors.getAll().slice(0, 5),
      recentCompanies: companies.getAll().slice(0, 5),
    };
  },
};

// --- Admin Auth ---
export const auth = {
  login: (password: string): boolean => {
    const correct = getItem<string>('bo_admin_pass', 'BoardOpp@2024');
    if (password === correct) {
      sessionStorage.setItem('bo_admin', '1');
      return true;
    }
    return false;
  },
  isLoggedIn: (): boolean => sessionStorage.getItem('bo_admin') === '1',
  logout: (): void => sessionStorage.removeItem('bo_admin'),
  changePassword: (newPass: string): void => setItem('bo_admin_pass', newPass),
};

// --- CSV Export ---
export function exportCsv(filename: string, rows: Record<string, string | number | boolean | string[]>[]): void {
  if (!rows.length) return;
  const keys = Object.keys(rows[0]);
  const csv = [
    keys.join(','),
    ...rows.map((r) =>
      keys.map((k) => {
        const v = r[k];
        const s = Array.isArray(v) ? v.join('; ') : String(v ?? '');
        return `"${s.replace(/"/g, '""')}"`;
      }).join(',')
    ),
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}
