import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  LayoutDashboard, Users, Building2, BookOpen, Handshake,
  Quote, UserSquare2, FileText, LogOut, Menu, X, ExternalLink,
} from "lucide-react";

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Director Leads', href: '/admin/directors', icon: Users },
  { label: 'Company Leads', href: '/admin/companies', icon: Building2 },
  { label: 'Assessments', href: '/admin/assessments', icon: BookOpen },
  { label: 'Partners', href: '/admin/partners', icon: Handshake },
  { label: 'Testimonials', href: '/admin/testimonials', icon: Quote },
  { label: 'Community', href: '/admin/community', icon: UserSquare2 },
  { label: 'Site Content', href: '/admin/content', icon: FileText },
];

export function AdminLayout({ children, onLogout }: { children: React.ReactNode; onLogout: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeHref = navItems.find((n) => n.href === location.pathname)?.href || '/admin';

  return (
    <div className="admin-root" style={{ minHeight: '100vh', background: '#0F0F10', display: 'flex', fontFamily: 'system-ui, sans-serif' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 240, flexShrink: 0, background: '#141416', borderRight: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: sidebarOpen ? 0 : '-240px', bottom: 0, zIndex: 200,
          transition: 'left 0.3s cubic-bezier(0.16,1,0.3,1)',
        }}
        className="md:!left-0"
      >
        {/* Logo */}
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, background: '#F99F1B', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(249,159,27,0.3)' }}>
              <span style={{ fontFamily: 'var(--font-display)', color: '#0A0A0A', fontSize: 14, fontWeight: 700 }}>B</span>
            </div>
            <div>
              <div style={{ color: '#F5F0E8', fontSize: 14, fontWeight: 600 }}>BoardOpp</div>
              <div style={{ color: '#F99F1B', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Admin Panel</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 10px', overflow: 'auto' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.href || (item.href !== '/admin' && location.pathname.startsWith(item.href));
            return (
              <button
                key={item.href}
                onClick={() => { navigate(item.href); setSidebarOpen(false); }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8,
                  background: active ? 'rgba(249,159,27,0.1)' : 'transparent',
                  border: active ? '1px solid rgba(249,159,27,0.2)' : '1px solid transparent',
                  color: active ? '#F99F1B' : '#6A6A7A', fontSize: 13, fontWeight: active ? 500 : 400,
                  cursor: 'pointer', transition: 'all 0.15s', marginBottom: 2, textAlign: 'left',
                }}
                onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#C0C0C8'; } }}
                onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6A6A7A'; } }}
              >
                <Icon size={15} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button
            onClick={() => window.open('/', '_blank')}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, background: 'transparent', border: '1px solid transparent', color: '#6A6A7A', fontSize: 13, cursor: 'pointer', marginBottom: 4, transition: 'all 0.15s' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#C0C0C8'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#6A6A7A'; e.currentTarget.style.background = 'transparent'; }}
          >
            <ExternalLink size={15} /> View Website
          </button>
          <button
            onClick={onLogout}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, background: 'transparent', border: '1px solid transparent', color: '#6A6A7A', fontSize: 13, cursor: 'pointer', transition: 'all 0.15s' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#FF6B6B'; e.currentTarget.style.background = 'rgba(255,107,107,0.06)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#6A6A7A'; e.currentTarget.style.background = 'transparent'; }}
          >
            <LogOut size={15} /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100 }}
          className="md:hidden"
        />
      )}

      {/* Main */}
      <div style={{ flex: 1, marginLeft: 0, display: 'flex', flexDirection: 'column' }} className="md:!ml-[240px]">
        {/* Topbar */}
        <header style={{ background: '#141416', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
          <button className="md:hidden" onClick={() => setSidebarOpen(true)} style={{ color: '#9B9BAB', background: 'none', border: 'none', cursor: 'pointer' }}>
            <Menu size={18} />
          </button>
          <div style={{ color: '#F5F0E8', fontSize: 15, fontWeight: 500 }}>
            {navItems.find((n) => location.pathname === n.href || (n.href !== '/admin' && location.pathname.startsWith(n.href)))?.label || 'Admin Panel'}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#4A4A5A', letterSpacing: '0.1em', textTransform: 'uppercase' }}>MentorMyBoard</div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, padding: '32px 24px', overflowY: 'auto', maxHeight: 'calc(100vh - 56px)' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
