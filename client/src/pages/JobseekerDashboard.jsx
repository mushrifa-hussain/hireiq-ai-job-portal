import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api.js';
import ScoreRing from '../components/ScoreRing.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import InterviewPrepModal from '../components/InterviewPrepModal.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function JobseekerDashboard() {
  const { user } = useAuth();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [interviewJob, setInterviewJob] = useState(null);

  useEffect(() => {
    api.get('/applications/me').then(({ data }) => setApps(data)).finally(() => setLoading(false));
  }, []);

  const handleWithdraw = async (id) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) return;
    const prev = apps;
    setApps((curr) => curr.filter((a) => a.id !== id));
    try {
      await api.delete(`/applications/${id}`);
    } catch (e) {
      setApps(prev);
      window.alert(e.response?.data?.error || 'Could not withdraw. Please try again.');
    }
  };

  const avg = apps.length ? Math.round(apps.reduce((s, a) => s + (a.analysis?.score || 0), 0) / apps.length) : 0;
  const best = apps.reduce((m, a) => Math.max(m, a.analysis?.score || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-end justify-between flex-wrap gap-4" style={{ animation: 'var(--animate-fade-up)' }}>
        <div>
          <span className="pill pill-brand">Jobseeker dashboard</span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mt-3">Welcome, {user?.name?.split(' ')[0]}</h1>
          <p className="text-gray-600 mt-2 text-lg">Track every application and your AI resume scores.</p>
        </div>
        <Link to="/jobs" className="btn btn-primary">Browse jobs <ArrowIcon /></Link>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mt-8" style={{ animation: 'var(--animate-fade-up)', animationDelay: '0.05s' }}>
        <StatCard label="Applications" value={apps.length} icon={<DocIcon />} />
        <StatCard label="Average score" value={avg} icon={<TargetIcon />} />
        <StatCard label="Best score" value={best} icon={<TrophyIcon />} />
      </div>

      <div className="mt-12 flex items-baseline justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Your applications</h2>
        {apps.length > 0 && <span className="text-sm text-gray-500">{apps.length} total</span>}
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 gap-5 mt-5">
          {[...Array(2)].map((_, i) => <div key={i} className="card p-5 h-40 animate-pulse" />)}
        </div>
      ) : apps.length === 0 ? (
        <div className="card p-16 text-center mt-5">
          <div className="w-14 h-14 mx-auto rounded-xl bg-brand-50 border border-brand-100 grid place-items-center mb-4 text-brand-600"><DocIcon size={24} /></div>
          <p className="text-gray-900 text-lg font-medium">You haven't applied to any jobs yet.</p>
          <p className="text-gray-500 text-sm mt-1">Find a role you love and apply with one click.</p>
          <Link to="/jobs" className="btn btn-primary mt-6 inline-flex">Find your first match <ArrowIcon /></Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5 mt-5">
          {apps.map((a, i) => (
            <ApplicationCard
              key={a.id}
              app={a}
              idx={i}
              onWithdraw={handleWithdraw}
              onInterviewPrep={() => setInterviewJob(a.job)}
            />
          ))}
        </div>
      )}

      {interviewJob && (
        <InterviewPrepModal
          jobId={interviewJob.id}
          jobTitle={interviewJob.title}
          jobCompany={interviewJob.company}
          onClose={() => setInterviewJob(null)}
        />
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

function ApplicationCard({ app, idx, onWithdraw, onInterviewPrep }) {
  const [open, setOpen] = useState(false);
  const score = app.analysis?.score || 0;

  return (
    <div className="card card-hover p-5" style={{ animation: 'var(--animate-fade-up)', animationDelay: `${idx * 0.04}s` }}>
      <div className="flex items-start gap-5">
        <ScoreRing score={score} size={88} stroke={8} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-gray-900 truncate">{app.job.title}</h3>
                {app.status === 'accepted' && (
                  <span title="Application accepted" className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex-shrink-0">
                    <TrophyIcon size={11} />
                  </span>
                )}
              </div>
              <p className="text-gray-500 text-sm">{app.job.company} · {app.job.location}</p>
            </div>
            <button
              onClick={() => onWithdraw(app.id)}
              className="text-xs font-medium px-2.5 py-1 rounded-md border border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-colors flex-shrink-0"
              title="Withdraw application"
            >
              Withdraw
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            <StatusBadge status={app.status} />
            <span className="pill">{app.job.type}</span>
            <span className="pill">{new Date(app.appliedAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-4 mt-3 flex-wrap">
            <button onClick={() => setOpen(!open)} className="text-sm text-brand-600 hover:text-brand-700 inline-flex items-center gap-1 font-medium">
              {open ? 'Hide' : 'View'} AI analysis
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? 'rotate(180deg)' : '' }}><polyline points="6 9 12 15 18 9" /></svg>
            </button>
            <button
              onClick={() => onInterviewPrep && onInterviewPrep()}
              className="text-sm font-medium px-2.5 py-1 rounded-md border border-brand-200 text-brand-700 hover:bg-brand-50 hover:border-brand-300 transition-colors inline-flex items-center gap-1.5"
              title="Generate AI interview questions for this job"
            >
              <SparkleIcon /> Interview prep
            </button>
          </div>
        </div>
      </div>

      {open && app.analysis && (
        <div className="mt-4 border-t border-gray-100 pt-4 space-y-4">
          {app.analysis.skills?.length > 0 && (
            <div>
              <div className="text-xs uppercase tracking-wider text-emerald-700 font-semibold mb-2">Matching skills</div>
              <div className="flex flex-wrap gap-1.5">{app.analysis.skills.map((s, i) => <span key={i} className="pill pill-emerald">{s}</span>)}</div>
            </div>
          )}
          {app.analysis.missing?.length > 0 && (
            <div>
              <div className="text-xs uppercase tracking-wider text-amber-700 font-semibold mb-2">Missing skills</div>
              <div className="flex flex-wrap gap-1.5">{app.analysis.missing.map((s, i) => <span key={i} className="pill pill-amber">{s}</span>)}</div>
            </div>
          )}
          {app.analysis.suggestions?.length > 0 && (
            <div>
              <div className="text-xs uppercase tracking-wider text-brand-600 font-semibold mb-2">Suggestions</div>
              <ul className="space-y-2">{app.analysis.suggestions.map((s, i) => (
                <li key={i} className="text-sm text-gray-700 flex gap-2 leading-relaxed"><span className="text-brand-600 mt-0.5">→</span>{s}</li>
              ))}</ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ArrowIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>; }
function SparkleIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.5 5.5L20 10l-5.5 2.5L12 18l-2.5-5.5L4 10l5.5-2.5z" /></svg>; }
function DocIcon({ size = 16 }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>; }
function TargetIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>; }
function TrophyIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 22V14h4v8" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2z" /></svg>; }
