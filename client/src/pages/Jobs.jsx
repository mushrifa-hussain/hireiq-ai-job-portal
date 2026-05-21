import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Jobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('all');
  const [skills, setSkills] = useState('');

  // 'all' | 'matches'
  const [view, setView] = useState('all');
  const [matches, setMatches] = useState([]);
  const [findingMatches, setFindingMatches] = useState(false);
  const [toast, setToast] = useState('');
  const toastTimer = useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 4000);
  };

  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (location) params.location = location;
      if (type && type !== 'all') params.type = type;
      if (skills) params.skills = skills;
      const { data } = await api.get('/jobs', { params });
      setJobs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); /* eslint-disable-next-line */ }, []);

  const onSubmit = (e) => { e.preventDefault(); setView('all'); fetchJobs(); };
  const reset = () => { setSearch(''); setLocation(''); setType('all'); setSkills(''); setView('all'); setTimeout(fetchJobs, 0); };
  const hasFilters = search || location || type !== 'all' || skills;

  const findMatches = async () => {
    setFindingMatches(true);
    try {
      const { data } = await api.get('/applications/recommendations');
      if (!data.hasResume) {
        showToast('Apply to a job first to get AI recommendations');
        return;
      }
      if (!data.jobs || data.jobs.length === 0) {
        showToast('No strong matches yet — try uploading a more detailed resume');
        return;
      }
      setMatches(data.jobs);
      setView('matches');
    } catch (e) {
      showToast(e.response?.data?.error || 'Could not load recommendations');
    } finally {
      setFindingMatches(false);
    }
  };

  const backToAll = () => setView('all');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      {toast && <Toast message={toast} onDismiss={() => setToast('')} />}

      <div className="mb-6" style={{ animation: 'var(--animate-fade-up)' }}>
        <span className="pill pill-brand">Open positions</span>
        <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-gray-900">Find your next role</h1>
        <p className="text-gray-600 mt-2.5 text-lg">Browse open positions and apply with AI-scored confidence.</p>
      </div>

      {user?.role === 'jobseeker' && view === 'all' && (
        <MatchBanner findingMatches={findingMatches} onClick={findMatches} />
      )}

      {view === 'matches' && (
        <div className="mb-6 flex items-baseline justify-between flex-wrap gap-2">
          <div>
            <span className="pill pill-brand">AI matches</span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
              Best roles for your skills
            </h2>
            <p className="text-gray-500 text-sm mt-1">{matches.length} {matches.length === 1 ? 'match' : 'matches'} ranked by compatibility</p>
          </div>
          <button onClick={backToAll} className="text-sm text-brand-600 hover:text-brand-700 font-medium inline-flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
            Back to all jobs
          </button>
        </div>
      )}

      {view === 'all' && (
        <form onSubmit={onSubmit} className="card p-4 md:p-5 mb-8" style={{ animation: 'var(--animate-fade-up)', animationDelay: '0.05s' }}>
          <div className="grid md:grid-cols-12 gap-3">
            <div className="md:col-span-4 relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input className="input pl-9" placeholder="Search title, company…" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <input className="input md:col-span-3" placeholder="Location (e.g. Remote)" value={location} onChange={(e) => setLocation(e.target.value)} />
            <select className="select md:col-span-2" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="all">All types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
            <input className="input md:col-span-2" placeholder="Skill (e.g. React)" value={skills} onChange={(e) => setSkills(e.target.value)} />
            <button className="btn btn-primary md:col-span-1" type="submit">Filter</button>
          </div>
          {hasFilters && (
            <button type="button" onClick={reset} className="text-xs text-gray-500 hover:text-gray-900 mt-3 inline-flex items-center gap-1">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              Clear filters
            </button>
          )}
        </form>
      )}

      {view === 'all' && (
        <div className="flex items-baseline justify-between mb-5">
          <p className="text-sm text-gray-500">
            {loading ? 'Searching…' : `${jobs.length} ${jobs.length === 1 ? 'opportunity' : 'opportunities'} found`}
          </p>
        </div>
      )}

      {view === 'matches' ? (
        <div className="grid md:grid-cols-2 gap-5">
          {matches.map((j, i) => <JobCard key={j.id} job={j} idx={i} matchScore={j.compatibility} />)}
        </div>
      ) : loading ? (
        <div className="grid md:grid-cols-2 gap-5">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : jobs.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="w-14 h-14 mx-auto rounded-xl bg-gray-50 grid place-items-center mb-4">
            <SearchIcon size={24} className="text-gray-400" />
          </div>
          {hasFilters ? (
            <>
              <p className="text-gray-900 text-lg font-medium">No jobs match your filters.</p>
              <p className="text-gray-500 text-sm mt-1">Try broadening your search.</p>
              <button onClick={reset} className="btn btn-ghost mt-5">Clear filters</button>
            </>
          ) : (
            <>
              <p className="text-gray-900 text-lg font-medium">No jobs posted yet.</p>
              <p className="text-gray-500 text-sm mt-1">Check back soon — new opportunities are added regularly.</p>
            </>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {jobs.map((j, i) => <JobCard key={j.id} job={j} idx={i} />)}
        </div>
      )}
    </div>
  );
}

function MatchBanner({ findingMatches, onClick }) {
  return (
    <div
      className="mb-6 rounded-2xl border border-brand-200 px-5 py-4 md:px-6 md:py-5 flex items-center justify-between gap-4 flex-wrap"
      style={{ background: '#ede9fe', animation: 'var(--animate-fade-up)' }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-11 h-11 rounded-xl bg-white border border-brand-100 grid place-items-center text-brand-600 flex-shrink-0 shadow-sm">
          <SparkleIcon size={20} />
        </div>
        <div className="min-w-0">
          <div className="text-base md:text-lg font-bold text-gray-900">Get AI-Matched Jobs</div>
          <div className="text-sm text-gray-600 mt-0.5">Let AI find the best roles based on your resume skills.</div>
        </div>
      </div>
      <button
        onClick={onClick}
        disabled={findingMatches}
        className="btn btn-outline inline-flex items-center gap-2 flex-shrink-0 disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ background: '#ffffff' }}
      >
        {findingMatches ? (
          <>
            <Spinner /> Analyzing your profile…
          </>
        ) : (
          <>Find My Matches <SparkleIcon size={14} /></>
        )}
      </button>
    </div>
  );
}

function Toast({ message, onDismiss }) {
  return (
    <div
      className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] max-w-md w-[calc(100%-2rem)]"
      style={{ animation: 'var(--animate-fade-up)' }}
    >
      <div className="card px-4 py-3 flex items-start gap-3 shadow-lg">
        <div className="w-8 h-8 rounded-full bg-brand-50 border border-brand-100 grid place-items-center text-brand-600 flex-shrink-0">
          <InfoIcon />
        </div>
        <div className="flex-1 text-sm text-gray-800 leading-relaxed pt-0.5">{message}</div>
        <button onClick={onDismiss} className="text-gray-400 hover:text-gray-700 -mt-0.5" aria-label="Dismiss">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>
      </div>
    </div>
  );
}

function JobCard({ job, idx, matchScore }) {
  const skills = (job.skills || '').split(',').map(s => s.trim()).filter(Boolean).slice(0, 4);
  const initial = job.company?.[0]?.toUpperCase() || 'C';
  return (
    <Link
      to={`/jobs/${job.id}`}
      className="card card-hover p-6 block group relative overflow-hidden"
      style={{ animation: 'var(--animate-fade-up)', animationDelay: `${idx * 0.04}s` }}
    >
      {typeof matchScore === 'number' && (
        <div className="absolute top-0 right-0 px-3 py-1.5 text-xs font-bold rounded-bl-lg border-l border-b bg-brand-50 border-brand-200 text-brand-700">
          {matchScore}% match
        </div>
      )}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-lg bg-gray-50 border border-gray-200 grid place-items-center font-bold text-gray-700 flex-shrink-0">
            {initial}
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-gray-900 group-hover:text-brand-700 transition-colors truncate">{job.title}</h3>
            <p className="text-gray-500 text-sm truncate">{job.company} · {job.location}</p>
          </div>
        </div>
        {typeof matchScore !== 'number' && (
          <span className="pill pill-brand flex-shrink-0">{job.type}</span>
        )}
      </div>
      <p className="text-gray-600 text-sm mt-4 leading-relaxed line-clamp-2">{job.description}</p>
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-4">
          {skills.map((s, i) => <span key={i} className="pill">{s}</span>)}
        </div>
      )}
      <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100 text-xs">
        <span className="text-brand-700 font-medium">{job.salary || 'Competitive salary'}</span>
        <span className="text-gray-500 inline-flex items-center gap-1.5">
          <UsersIcon /> {job._count?.applications ?? 0} applicant{job._count?.applications === 1 ? '' : 's'}
        </span>
      </div>
    </Link>
  );
}

function SkeletonCard() {
  return (
    <div className="card p-6 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-lg bg-gray-100" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/3 bg-gray-100 rounded" />
          <div className="h-3 w-1/2 bg-gray-100 rounded" />
        </div>
      </div>
      <div className="h-3 w-full bg-gray-100 rounded mt-4" />
      <div className="h-3 w-4/5 bg-gray-100 rounded mt-2" />
      <div className="flex gap-2 mt-4">
        <div className="h-6 w-16 bg-gray-100 rounded-full" />
        <div className="h-6 w-20 bg-gray-100 rounded-full" />
      </div>
    </div>
  );
}

function SearchIcon({ size = 16, className = '' }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;
}
function UsersIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>; }
function SparkleIcon({ size = 14 }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.5 5.5L20 10l-5.5 2.5L12 18l-2.5-5.5L4 10l5.5-2.5z" /></svg>; }
function InfoIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>; }
function Spinner() { return <span className="inline-block w-3.5 h-3.5 rounded-full border-2 border-brand-200 border-t-brand-600 animate-spin" />; }
