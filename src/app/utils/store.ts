// Data layer for BoardOpp admin and public forms.
// Site content (assessments, partners, testimonials, community, settings) is
// backed by the real server database; only admin auth uses sessionStorage.

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

// --- Site content API helper ---
// Assessments, partners, testimonials, community, and site content live in the
// real SQLite database (server/db.js) — not localStorage — so admin edits are
// visible to every visitor, not just the browser that made the edit.
async function apiGet<T>(url: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(url);
    if (!res.ok) return fallback;
    return await res.json();
  } catch {
    return fallback;
  }
}

async function apiAdminGet<T>(url: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(url, { headers: { 'x-admin-token': ADMIN_API_TOKEN } });
    if (!res.ok) return fallback;
    return await res.json();
  } catch {
    return fallback;
  }
}

async function apiAdminMutate(url: string, method: 'POST' | 'PUT' | 'DELETE', body?: unknown): Promise<void> {
  await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json', 'x-admin-token': ADMIN_API_TOKEN },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

// --- Assessments ---
export const assessments = {
  getAll: (): Promise<Assessment[]> => apiAdminGet('/api/admin/assessments', []),
  getActive: (): Promise<Assessment[]> => apiGet('/api/assessments', []),
  add: (data: Omit<Assessment, 'id'>): Promise<void> => apiAdminMutate('/api/admin/assessments', 'POST', data),
  update: (id: string, data: Partial<Assessment>): Promise<void> => apiAdminMutate(`/api/admin/assessments/${id}`, 'PUT', data),
  remove: (id: string): Promise<void> => apiAdminMutate(`/api/admin/assessments/${id}`, 'DELETE'),
};

// --- Partners ---
export const partners = {
  getAll: (): Promise<Partner[]> => apiAdminGet('/api/admin/partners', []),
  getActive: (): Promise<Partner[]> => apiGet('/api/partners', []),
  add: (data: Omit<Partner, 'id'>): Promise<void> => apiAdminMutate('/api/admin/partners', 'POST', data),
  update: (id: string, data: Partial<Partner>): Promise<void> => apiAdminMutate(`/api/admin/partners/${id}`, 'PUT', data),
  remove: (id: string): Promise<void> => apiAdminMutate(`/api/admin/partners/${id}`, 'DELETE'),
};

// --- Testimonials ---
export const testimonials = {
  getAll: (): Promise<Testimonial[]> => apiAdminGet('/api/admin/testimonials', []),
  getActive: (): Promise<Testimonial[]> => apiGet('/api/testimonials', []),
  add: (data: Omit<Testimonial, 'id'>): Promise<void> => apiAdminMutate('/api/admin/testimonials', 'POST', data),
  update: (id: string, data: Partial<Testimonial>): Promise<void> => apiAdminMutate(`/api/admin/testimonials/${id}`, 'PUT', data),
  remove: (id: string): Promise<void> => apiAdminMutate(`/api/admin/testimonials/${id}`, 'DELETE'),
};

// --- Community Members ---
export const community = {
  getAll: (): Promise<CommunityMember[]> => apiAdminGet('/api/admin/community', []),
  getActive: (): Promise<CommunityMember[]> => apiGet('/api/community', []),
  add: (data: Omit<CommunityMember, 'id'>): Promise<void> => apiAdminMutate('/api/admin/community', 'POST', data),
  update: (id: string, data: Partial<CommunityMember>): Promise<void> => apiAdminMutate(`/api/admin/community/${id}`, 'PUT', data),
  remove: (id: string): Promise<void> => apiAdminMutate(`/api/admin/community/${id}`, 'DELETE'),
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
    { label: 'Governance Professionals', value: '5000+', sub: 'In our network' },
    { label: 'Programs Conducted', value: '1000+', sub: 'By MentorMyBoard' },
    { label: 'Board Opportunities', value: '200+', sub: 'Facilitated to date' },
  ],
  footerTagline: 'Transforming governance leadership across India.',
  contactEmail: 'hello@mentormyboard.com',
  contactPhone: '+91 98765 43210',
  assessmentCardUrl: '#',
  boardAssessmentUrl: '#',
};

export const content = {
  get: (): Promise<SiteContent> => apiGet('/api/content', defaultContent),
  update: (data: Partial<SiteContent>): Promise<void> => apiAdminMutate('/api/admin/content', 'PUT', data),
  reset: (): Promise<void> => apiAdminMutate('/api/admin/content/reset', 'POST', defaultContent),
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
