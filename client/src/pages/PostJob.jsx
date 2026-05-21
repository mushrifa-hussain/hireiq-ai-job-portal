import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api.js';

export default function PostJob() {
  const [form, setForm] = useState({
    title: '', company: '', location: '', type: 'Full-time',
    salary: '', description: '', requirements: '', skills: '',
  });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const { data } = await api.post('/jobs', form);
      navigate(`/jobs/${data.id}`);
    } catch (e) {
      setErr(e.response?.data?.error || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/dashboard/recruiter" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
        Back to dashboard
      </Link>

      <div className="mt-4" style={{ animation: 'var(--animate-fade-up)' }}>
        <span className="pill pill-brand">New posting</span>
        <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-gray-900">Post a job</h1>
        <p className="text-gray-600 mt-2.5 text-lg">Reach great candidates and let HireIQ rank them by AI fit.</p>
      </div>

      <form onSubmit={submit} className="card p-6 md:p-8 mt-8 space-y-5" style={{ animation: 'var(--animate-fade-up)', animationDelay: '0.05s' }}>
        <SectionHeader n="01" title="The basics" />
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Title" required><input className="input" required value={form.title} onChange={update('title')} placeholder="Senior Frontend Engineer" /></Field>
          <Field label="Company" required><input className="input" required value={form.company} onChange={update('company')} placeholder="Acme Inc." /></Field>
          <Field label="Location" required><input className="input" required value={form.location} onChange={update('location')} placeholder="Remote, Bengaluru, etc." /></Field>
          <Field label="Type" required>
            <select className="select" value={form.type} onChange={update('type')}>
              <option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option>
            </select>
          </Field>
          <Field label="Salary range (optional)">
            <input className="input" value={form.salary} onChange={update('salary')} placeholder="₹15-25 LPA" />
          </Field>
          <Field label="Required skills" required hint="comma-separated">
            <input className="input" required value={form.skills} onChange={update('skills')} placeholder="React, TypeScript, Tailwind" />
          </Field>
        </div>

        <div className="divider my-2" />

        <SectionHeader n="02" title="The role" />
        <Field label="Description" required>
          <textarea className="textarea" rows={6} required value={form.description} onChange={update('description')} placeholder="Tell candidates what they'll work on, the team, and what success looks like…" />
        </Field>
        <Field label="Requirements" required hint="one per line">
          <textarea className="textarea" rows={6} required value={form.requirements} onChange={update('requirements')} placeholder={'3+ years of React experience\nStrong CSS skills\nExperience with REST APIs'} />
        </Field>

        {err && <div className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2.5">{err}</div>}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? 'Publishing…' : 'Publish job'}
          </button>
          <Link to="/dashboard/recruiter" className="btn btn-ghost">Cancel</Link>
        </div>
      </form>
    </div>
  );
}

function SectionHeader({ n, title }) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-xs tracking-wider text-brand-600 font-semibold">SECTION {n}</span>
      <span className="h-px flex-1 bg-gray-100" />
      <span className="text-sm font-semibold text-gray-700">{title}</span>
    </div>
  );
}

function Field({ label, required, hint, children }) {
  return (
    <label className="block">
      <span className="text-sm text-gray-700 mb-1.5 flex items-center gap-1.5 font-medium">
        {label} {required && <span className="text-brand-600">*</span>}
        {hint && <span className="text-gray-400 text-[11px] font-normal">— {hint}</span>}
      </span>
      {children}
    </label>
  );
}
