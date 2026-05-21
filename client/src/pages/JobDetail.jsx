import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import ScoreRing from '../components/ScoreRing.jsx';

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    api.get(`/jobs/${id}`)
      .then(({ data }) => setJob(data))
      .catch(() => setErr('Job not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const apply = async (e) => {
    e.preventDefault();
    setErr('');
    if (!user) return navigate('/login');
    if (user.role !== 'jobseeker') return setErr('Only jobseekers can apply.');
    if (!file) return setErr('Please select a PDF resume.');

    const fd = new FormData();
    fd.append('resume', file);

    setSubmitting(true);
    try {
      const { data } = await api.post(`/applications/jobs/${id}/apply`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(data.analysis);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      setErr(e.response?.data?.error || 'Application failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center text-gray-500 py-32">Loading…</div>;
  if (!job) return <div className="text-center text-gray-500 py-32">Job not found.</div>;

  const skills = (job.skills || '').split(',').map(s => s.trim()).filter(Boolean);
  const requirements = (job.requirements || '').split('\n').map(s => s.trim()).filter(Boolean);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/jobs" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
        Back to jobs
      </Link>

      {result && <AnalysisResult result={result} job={job} />}

      <div className="grid lg:grid-cols-3 gap-6 mt-5" style={{ animation: 'var(--animate-fade-up)' }}>
        <div className="lg:col-span-2 card p-7 md:p-9">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-200 grid place-items-center font-bold text-2xl text-gray-700 flex-shrink-0">
              {job.company[0]?.toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">{job.title}</h1>
              <p className="text-gray-600 mt-1">{job.company} · {job.location}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="pill pill-brand">{job.type}</span>
                {job.salary && <span className="pill">{job.salary}</span>}
                <span className="pill">{job._count?.applications ?? 0} applicants</span>
                <span className="pill">Posted {new Date(job.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <Section title="Description">
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">{job.description}</p>
          </Section>

          <Section title="Requirements">
            <ul className="space-y-2.5">
              {requirements.map((r, i) => (
                <li key={i} className="flex gap-3 text-gray-700">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Required skills">
            <div className="flex flex-wrap gap-2">
              {skills.map((s, i) => <span key={i} className="pill pill-brand">{s}</span>)}
            </div>
          </Section>
        </div>

        {/* Apply card */}
        <div className="lg:col-span-1">
          <div className="card p-6 lg:sticky lg:top-24 shadow-sm">
            {!result ? (
              (!user || user.role === 'jobseeker') ? (
                <>
                  <div className="text-xs uppercase tracking-wider text-brand-600 font-semibold mb-1.5">Apply with AI</div>
                  <h3 className="text-lg font-bold text-gray-900">Get your match score</h3>
                  <p className="text-gray-600 text-sm mt-1">Upload your resume PDF. Our AI analyzes it instantly.</p>
                  <form onSubmit={apply} className="mt-5">
                    <label className="block">
                      <span className="text-sm text-gray-700 mb-2 block font-medium">Resume (PDF, max 5MB)</span>
                      <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} className="file-input" />
                    </label>
                    {file && (
                      <div className="mt-3 text-xs text-gray-500 inline-flex items-center gap-2">
                        <FileIcon /> {file.name}
                      </div>
                    )}
                    {err && <div className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2 mt-3">{err}</div>}
                    <button className="btn btn-primary w-full mt-5" disabled={submitting}>
                      {submitting ? <><Spinner /> Analyzing…</> : <>Apply & Analyze <ArrowIcon /></>}
                    </button>
                    {!user && <p className="text-[11px] text-gray-500 mt-3 text-center">You'll be asked to sign in first.</p>}
                  </form>

                  <div className="divider my-5" />

                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <SparkIcon className="text-brand-600" /> Powered by AI
                  </div>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="text-gray-700 font-medium">You're signed in as a recruiter.</div>
                  <p className="text-gray-500 text-sm mt-1">Switch to a jobseeker account to apply.</p>
                </div>
              )
            ) : (
              <div className="text-center py-6">
                <div className="text-emerald-700 text-sm font-semibold">Application submitted!</div>
                <p className="text-gray-600 text-sm mt-2">See your analysis above.</p>
                <Link to="/dashboard/jobseeker" className="btn btn-primary w-full mt-5">View dashboard</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mt-9">
      <h2 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}

function AnalysisResult({ result, job }) {
  return (
    <div className="mt-6 mb-2" style={{ animation: 'var(--animate-fade-up)' }}>
      <div className="card p-6 md:p-8 shadow-sm">
        <div className="mb-5">
          <span className="pill pill-brand">AI analysis complete</span>
          <h2 className="text-2xl font-bold mt-3 text-gray-900">Your match for {job.title}</h2>
          <p className="text-gray-500 text-sm mt-1">Powered by AI</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-center">
          <div className="grid place-items-center">
            <ScoreRing score={result.score} size={180} />
          </div>
          <div className="md:col-span-2 grid sm:grid-cols-2 gap-5">
            <div>
              <div className="text-xs uppercase tracking-wider text-emerald-700 font-semibold mb-2">Matching ({result.skills?.length || 0})</div>
              {result.skills?.length ? (
                <div className="flex flex-wrap gap-1.5">{result.skills.map((s, i) => <span key={i} className="pill pill-emerald">{s}</span>)}</div>
              ) : <p className="text-gray-400 text-sm">None detected.</p>}
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-amber-700 font-semibold mb-2">Missing ({result.missing?.length || 0})</div>
              {result.missing?.length ? (
                <div className="flex flex-wrap gap-1.5">{result.missing.map((s, i) => <span key={i} className="pill pill-amber">{s}</span>)}</div>
              ) : <p className="text-gray-400 text-sm">Nothing major missing.</p>}
            </div>
          </div>
        </div>

        {result.suggestions?.length > 0 && (
          <div className="mt-7 pt-6 border-t border-gray-100">
            <div className="text-xs uppercase tracking-wider text-brand-600 font-semibold mb-3">Improvement suggestions</div>
            <ul className="space-y-3">
              {result.suggestions.map((s, i) => (
                <li key={i} className="flex gap-3 text-gray-700 text-sm leading-relaxed">
                  <span className="mt-0.5 w-6 h-6 rounded-full bg-brand-50 border border-brand-100 grid place-items-center flex-shrink-0 text-[11px] font-bold text-brand-700">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function Spinner() { return <span className="inline-block w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />; }
function ArrowIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>; }
function FileIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>; }
function SparkIcon({ className = '' }) { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 2l2.5 5.5L20 10l-5.5 2.5L12 18l-2.5-5.5L4 10l5.5-2.5z" /></svg>; }
