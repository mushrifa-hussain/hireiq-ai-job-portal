import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get('/jobs/recruiter/mine').then(({ data }) => setJobs(data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const totalApps = jobs.reduce((s, j) => s + (j._count?.applications || 0), 0);

  const remove = async (id) => {
    if (!window.confirm('Delete this job and all its applications?')) return;
    await api.delete(`/jobs/${id}`);
    load();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-end justify-between flex-wrap gap-4" style={{ animation: 'var(--animate-fade-up)' }}>
        <div>
          <span className="pill pill-brand">Recruiter dashboard</span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mt-3">Hi, {user?.name?.split(' ')[0]}</h1>
          <p className="text-gray-600 mt-2 text-lg">Manage your job posts and review AI-ranked applicants.</p>
        </div>
        <Link to="/post-job" className="btn btn-primary">+ Post new job</Link>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mt-8" style={{ animation: 'var(--animate-fade-up)', animationDelay: '0.05s' }}>
        <StatCard label="Active job posts" value={jobs.length} icon={<BriefcaseIcon />} />
        <StatCard label="Total applications" value={totalApps} icon={<UsersIcon />} />
      </div>

      <div className="mt-12 flex items-baseline justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Your jobs</h2>
        {jobs.length > 0 && <span className="text-sm text-gray-500">{jobs.length} posted</span>}
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 gap-5 mt-5">
          {[...Array(2)].map((_, i) => <div key={i} className="card p-5 h-44 animate-pulse" />)}
        </div>
      ) : jobs.length === 0 ? (
        <div className="card p-16 text-center mt-5">
          <div className="w-14 h-14 mx-auto rounded-xl bg-brand-50 border border-brand-100 grid place-items-center mb-4 text-brand-600"><BriefcaseIcon size={24} /></div>
          <p className="text-gray-900 text-lg font-medium">You haven't posted any jobs yet.</p>
          <p className="text-gray-500 text-sm mt-1">Reach great candidates and let HireIQ rank them.</p>
          <Link to="/post-job" className="btn btn-primary mt-6 inline-flex">Post your first job</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5 mt-5">
          {jobs.map((j, i) => (
            <div key={j.id} className="card card-hover p-5" style={{ animation: 'var(--animate-fade-up)', animationDelay: `${i * 0.04}s` }}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-lg bg-gray-50 border border-gray-200 grid place-items-center font-bold text-gray-700 flex-shrink-0">
                    {j.company[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 truncate">{j.title}</h3>
                    <p className="text-gray-500 text-sm truncate">{j.company} · {j.location}</p>
                  </div>
                </div>
                <span className="pill pill-brand flex-shrink-0">{j.type}</span>
              </div>

              <div className="mt-4 p-3 rounded-lg bg-gray-50 border border-gray-200/70 flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Applicants</div>
                  <div className="text-2xl font-bold tabular-nums text-gray-900 mt-0.5">{j._count?.applications ?? 0}</div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-brand-50 border border-brand-100 grid place-items-center text-brand-600">
                  <UsersIcon />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                <Link to={`/jobs/${j.id}/applicants`} className="btn btn-primary btn-sm">View applicants</Link>
                <Link to={`/jobs/${j.id}`} className="btn btn-ghost btn-sm">View post</Link>
                <button onClick={() => remove(j.id)} className="btn btn-ghost btn-sm text-rose-600 hover:text-rose-700" title="Delete">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">{label}</div>
        <div className="w-9 h-9 rounded-lg bg-brand-50 border border-brand-100 grid place-items-center text-brand-600">{icon}</div>
      </div>
      <div className="text-4xl font-bold tabular-nums text-gray-900 mt-3 tracking-tight">{value}</div>
    </div>
  );
}

function BriefcaseIcon({ size = 16 }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>; }
function UsersIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>; }
