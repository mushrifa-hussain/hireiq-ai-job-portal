import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  const handleLogout = () => { logout(); navigate('/'); };
  const dashboardLink = user?.role === 'recruiter' ? '/dashboard/recruiter' : '/dashboard/jobseeker';
  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-gray-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-brand-600 grid place-items-center text-white font-bold text-base">H</div>
          <div className="leading-none">
            <div className="text-base font-semibold tracking-tight text-gray-900">HireIQ</div>
            <div className="text-[9px] uppercase tracking-[0.18em] text-gray-500 font-medium mt-0.5">AI-Powered Job Portal</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/" active={isActive('/') && location.pathname === '/'}>Home</NavLink>
          <NavLink to="/jobs" active={isActive('/jobs') && !location.pathname.includes('applicants')}>Jobs</NavLink>
          {user && <NavLink to={dashboardLink} active={isActive('/dashboard')}>Dashboard</NavLink>}
          {user?.role === 'recruiter' && <NavLink to="/post-job" active={isActive('/post-job')}>Post job</NavLink>}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              <div className="flex items-center gap-2 mr-2">
                <div className="w-7 h-7 rounded-full bg-brand-600 grid place-items-center text-xs font-semibold text-white">
                  {user.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="text-sm leading-tight">
                  <div className="text-gray-900">{user.name.split(' ')[0]}</div>
                  <div className="text-gray-500 text-[11px] capitalize">{user.role}</div>
                </div>
              </div>
              <button onClick={handleLogout} className="btn btn-ghost btn-sm">Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get started</Link>
            </>
          )}
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden p-2 -mr-2 text-gray-700" aria-label="Menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {open
              ? (<><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>)
              : (<><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>)}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3 flex flex-col gap-1">
          <MobileLink to="/">Home</MobileLink>
          <MobileLink to="/jobs">Jobs</MobileLink>
          {user && <MobileLink to={dashboardLink}>Dashboard</MobileLink>}
          {user?.role === 'recruiter' && <MobileLink to="/post-job">Post job</MobileLink>}
          <div className="h-px bg-gray-200 my-2" />
          {user ? (
            <button onClick={handleLogout} className="btn btn-ghost">Sign out</button>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="btn btn-ghost flex-1">Login</Link>
              <Link to="/register" className="btn btn-primary flex-1">Get started</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

function NavLink({ to, children, active }) {
  return (
    <Link
      to={to}
      className={`relative px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 ${
        active ? 'text-brand-600' : 'text-gray-500 hover:text-brand-600'
      }`}
    >
      {children}
    </Link>
  );
}

function MobileLink({ to, children }) {
  return <Link to={to} className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-50">{children}</Link>;
}
