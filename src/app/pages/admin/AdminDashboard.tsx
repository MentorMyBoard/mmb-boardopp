import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { analytics, fetchDirectorLeads, fetchCompanyLeads } from "../../utils/store";
import type { DirectorLead, CompanyLead, AnalyticsEntry } from "../../utils/store";
import { Users, Building2, TrendingUp, MousePointerClick, ArrowRight } from "lucide-react";

const STAT_COLORS = ['#F99F1B', '#8890FF', '#5FCF8A', '#F0A064'];

export function AdminDashboard() {
  const navigate = useNavigate();
  const [totals, setTotals] = useState(analytics.getTotals());
  const [chartData, setChartData] = useState<AnalyticsEntry[]>([]);

  useEffect(() => {
    setChartData(analytics.getLast30Days());
    Promise.all([fetchDirectorLeads(), fetchCompanyLeads()])
      .then(([dirs, comps]) => {
        setTotals((t) => ({
          ...t,
          totalDirectors: dirs.length,
          totalCompanies: comps.length,
          recentDirectors: dirs.slice(0, 5),
          recentCompanies: comps.slice(0, 5),
        }));
      })
      .catch(() => { /* server unreachable — keep local fallback totals */ });
  }, []);

  const stats = [
    { label: 'Director Registrations', value: totals.totalDirectors, icon: Users, color: '#F99F1B', href: '/admin/directors' },
    { label: 'Company Registrations', value: totals.totalCompanies, icon: Building2, color: '#8890FF', href: '/admin/companies' },
    { label: 'Assessment Clicks', value: totals.totalAssessmentClicks, icon: MousePointerClick, color: '#5FCF8A', href: '#' },
    { label: 'Page Views', value: totals.totalPageViews, icon: TrendingUp, color: '#F0A064', href: '#' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 style={{ color: '#F5F0E8', fontSize: 22, fontWeight: 500, marginBottom: 4 }}>Dashboard</h2>
        <p style={{ color: '#6A6A7A', fontSize: 14 }}>Overview of BoardOpp platform activity and submissions.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <button
              key={stat.label}
              onClick={() => stat.href !== '#' && navigate(stat.href)}
              style={{
                background: '#1A1A1D', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '20px',
                textAlign: 'left', cursor: stat.href !== '#' ? 'pointer' : 'default', transition: 'all 0.2s', width: '100%',
              }}
              onMouseEnter={(e) => { if (stat.href !== '#') { e.currentTarget.style.borderColor = `${stat.color}40`; e.currentTarget.style.boxShadow = `0 8px 24px ${stat.color}12`; } }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: `${stat.color}18`, border: `1px solid ${stat.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={16} color={stat.color} />
                </div>
                {stat.href !== '#' && <ArrowRight size={14} color="#4A4A5A" />}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 400, color: stat.color, lineHeight: 1, marginBottom: 6 }}>
                {stat.value.toLocaleString()}
              </div>
              <div style={{ color: '#7A7A8A', fontSize: 12 }}>{stat.label}</div>
            </button>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Page views chart */}
        <div style={{ background: '#1A1A1D', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: 24 }}>
          <h3 style={{ color: '#F5F0E8', fontSize: 15, fontWeight: 500, marginBottom: 20 }}>Page Views — Last 14 Days</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: -30 }}>
              <defs>
                <linearGradient id="pgv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F99F1B" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#F99F1B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fill: '#4A4A5A', fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fill: '#4A4A5A', fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#1A1A1D', border: '1px solid rgba(249,159,27,0.2)', borderRadius: 8, color: '#F5F0E8', fontSize: 12 }} />
              <Area type="monotone" dataKey="pageViews" stroke="#F99F1B" strokeWidth={2} fill="url(#pgv)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Submissions chart */}
        <div style={{ background: '#1A1A1D', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: 24 }}>
          <h3 style={{ color: '#F5F0E8', fontSize: 15, fontWeight: 500, marginBottom: 20 }}>Form Submissions — Last 14 Days</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: -30 }}>
              <XAxis dataKey="date" tick={{ fill: '#4A4A5A', fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fill: '#4A4A5A', fontSize: 10 }} allowDecimals={false} />
              <Tooltip contentStyle={{ background: '#1A1A1D', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#F5F0E8', fontSize: 12 }} />
              <Bar dataKey="directorForms" name="Directors" fill="#F99F1B" radius={[3, 3, 0, 0]} />
              <Bar dataKey="companyForms" name="Companies" fill="#8890FF" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <RecentLeads title="Recent Director Registrations" leads={totals.recentDirectors} type="director" onViewAll={() => navigate('/admin/directors')} />
        <RecentLeads title="Recent Company Registrations" leads={totals.recentCompanies} type="company" onViewAll={() => navigate('/admin/companies')} />
      </div>
    </div>
  );
}

function RecentLeads({ title, leads, type, onViewAll }: { title: string; leads: DirectorLead[] | CompanyLead[]; type: 'director' | 'company'; onViewAll: () => void }) {
  return (
    <div style={{ background: '#1A1A1D', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h3 style={{ color: '#F5F0E8', fontSize: 14, fontWeight: 500 }}>{title}</h3>
        <button onClick={onViewAll} style={{ color: '#F99F1B', fontSize: 12, background: 'none', border: 'none', cursor: 'pointer' }}>View All →</button>
      </div>
      {leads.length === 0 ? (
        <p style={{ color: '#4A4A5A', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>No submissions yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {leads.map((lead: DirectorLead | CompanyLead) => {
            const name = type === 'director' ? (lead as DirectorLead).name : (lead as CompanyLead).companyName;
            const sub = type === 'director' ? (lead as DirectorLead).designation : (lead as CompanyLead).contactPerson;
            const date = new Date(lead.submittedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
            return (
              <div key={lead.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
                <div>
                  <div style={{ color: '#E0E0E8', fontSize: 13, fontWeight: 500 }}>{name}</div>
                  <div style={{ color: '#5A5A6A', fontSize: 11, marginTop: 2 }}>{sub}</div>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#5A5A6A' }}>{date}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
