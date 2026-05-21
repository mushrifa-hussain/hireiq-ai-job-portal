import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { API_BASE_URL } from '../api.js';
import ScoreRing from '../components/ScoreRing.jsx';
import StatusBadge from '../components/StatusBadge.jsx';

export default function JobApplicants() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    api.get(`/applications/job/${id}`)
      .then(({ data }) => setData(data))
      .catch((e) => setErr(e.response?.data?.error || 'Failed to load'))
      .finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (appId, status) => {
    const prev = data;
    setData((curr) => ({
      ...curr,
      applications: curr.applications.map((a) => (a.id === appId ? { ...a, status } : a)),
    }));
    try {
      await api.patch(`/applications/${appId}/status`, { status });
    } catch (e) {
      setData(prev);
      window.alert(e.response?.data?.error || 'Could not update status. Please try again.');
    }
  };

  if (loading) return <div className="text-center text-gray-500 py-32">Loading…</div>;
  if (err) return <div className="text-center text-rose-600 py-32">{err}</div>;

  const { job, applications } = data;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/dashboard/recruiter" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
        Back to dashboard
      </Link>

      <div className="mt-4" style={{ animation: 'var(--animate-fade-up)' }}>
        <span className="pill pill-brand">Applicants</span>
        <h1 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-gray-900">{job.title}</h1>
        <p className="text-gray-600 mt-1">{job.company} · {job.location}</p>
        <p className="text-gray-500 text-sm mt-3 inline-flex items-center gap-2">
          <SparkleIcon className="text-brand-600" /> {applications.length} applicant{applications.length === 1 ? '' : 's'} · ranked by AI fit
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="card p-16 text-center mt-8">
          <div className="w-14 h-14 mx-auto rounded-xl bg-brand-50 border border-brand-100 grid place-items-center mb-4 text-brand-600"><UsersIcon size={24} /></div>
          <p className="text-gray-900 text-lg font-medium">No applicants yet.</p>
          <p className="text-gray-500 text-sm mt-1">Share your job posting to attract candidates.</p>
        </div>
      ) : (
        <div className="space-y-4 mt-8">
          {applications.map((a, idx) => (
            <ApplicantRow key={a.id} app={a} rank={idx + 1} onUpdateStatus={updateStatus} />
          ))}
        </div>
      )}
    </div>
  );
}

const RANK_STYLES = {
  1: { bg: 'bg-amber-100', border: 'border-amber-200', text: 'text-amber-800' },
  2: { bg: 'bg-gray-100', border: 'border-gray-200', text: 'text-gray-700' },
  3: { bg: 'bg-orange-100', border: 'border-orange-200', text: 'text-orange-800' },
};

function ApplicantRow({ app, rank, onUpdateStatus }) {
  const [open, setOpen] = useState(false);
  const score = app.analysis?.score || 0;
  const r = RANK_STYLES[rank];
  const status = app.status || 'pending';

  const viewResume = async () => {
    const token = localStorage.getItem('hireiq_token');
    try {
      const res = await fetch(`${API_BASE_URL}/applications/resume/${app.resumePath}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      window.open(URL.createObjectURL(blob), '_blank');
    } catch {
      alert('Could not load resume');
    }
  };

  return (
    <div className="card p-5" style={{ animation: 'var(--animate-fade-up)' }}>
      <div className="flex flex-col md:flex-row md:items-center gap-5">
        <div className="flex items-center gap-4">
          <div className={`w-11 h-11 rounded-lg grid place-items-center font-bold text-sm ${r ? `${r.bg} ${r.border} ${r.text} border` : 'bg-gray-50 border border-gray-200 text-gray-500'}`}>
            #{rank}
          </div>
          <ScoreRing score={score} size={86} stroke={8} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-semibold text-gray-900">{app.user.name}</h3>
            <StatusBadge status={status} />
          </div>
          <p className="text-gray-500 text-sm mt-0.5">{app.user.email}</p>
          <p className="text-gray-400 text-xs mt-1.5">Applied {new Date(app.appliedAt).toLocaleString()}</p>
        </div>
        <div className="flex flex-wrap gap-2 md:flex-col md:items-stretch">
          <div className="flex gap-2">
            <button
              onClick={() => onUpdateStatus(app.id, status === 'accepted' ? 'pending' : 'accepted')}
              className={`flex-1 md:flex-none text-xs font-medium px-3 py-1.5 rounded-md border transition-colors inline-flex items-center justify-center gap-1.5 ${
                status === 'accepted'
                  ? 'bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700'
                  : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300'
              }`}
              title={status === 'accepted' ? 'Click to undo' : 'Accept applicant'}
            >
              <CheckIcon /> {status === 'accepted' ? 'Accepted' : 'Accept'}
            </button>
            <button
              onClick={() => onUpdateStatus(app.id, status === 'rejected' ? 'pending' : 'rejected')}
              className={`flex-1 md:flex-none text-xs font-medium px-3 py-1.5 rounded-md border transition-colors inline-flex items-center justify-center gap-1.5 ${
                status === 'rejected'
                  ? 'bg-rose-600 border-rose-600 text-white hover:bg-rose-700'
                  : 'border-rose-200 text-rose-700 hover:bg-rose-50 hover:border-rose-300'
              }`}
              title={status === 'rejected' ? 'Click to undo' : 'Reject applicant'}
            >
              <XIcon /> {status === 'rejected' ? 'Rejected' : 'Reject'}
            </button>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setOpen(!open)} className="btn btn-ghost btn-sm flex-1">
              {open ? 'Hide' : 'View AI'}
            </button>
            <button onClick={viewResume} className="btn btn-primary btn-sm flex-1">Resume</button>
          </div>
        </div>
      </div>

      {open && app.analysis && (
        <div className="mt-5 pt-5 border-t border-gray-100 grid md:grid-cols-2 gap-5">
          <div className="space-y-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-emerald-700 font-semibold mb-2">Matching skills</div>
              <div className="flex flex-wrap gap-1.5">
                {app.analysis.skills?.length ? app.analysis.skills.map((s, i) => (
                  <span key={i} className="pill pill-emerald">{s}</span>
                )) : <span className="text-gray-400 text-sm">None.</span>}
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-amber-700 font-semibold mb-2">Missing skills</div>
              <div className="flex flex-wrap gap-1.5">
                {app.analysis.missing?.length ? app.analysis.missing.map((s, i) => (
                  <span key={i} className="pill pill-amber">{s}</span>
                )) : <span className="text-gray-400 text-sm">None.</span>}
              </div>
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-brand-600 font-semibold mb-2">AI suggestions for candidate</div>
            <ul className="space-y-2">
              {app.analysis.suggestions?.map((s, i) => (
                <li key={i} className="text-sm text-gray-700 flex gap-2 leading-relaxed"><span className="text-brand-600 mt-0.5">→</span>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function SparkleIcon({ className = '' }) { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 2l2.5 5.5L20 10l-5.5 2.5L12 18l-2.5-5.5L4 10l5.5-2.5z" /></svg>; }
function UsersIcon({ size = 16 }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>; }
function CheckIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>; }
function XIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>; }
