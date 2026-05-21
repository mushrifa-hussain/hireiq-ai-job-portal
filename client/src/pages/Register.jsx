import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('jobseeker');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', { name, email, password, role });
      login(data.token, data.user);
      navigate(data.user.role === 'recruiter' ? '/dashboard/recruiter' : '/dashboard/jobseeker');
    } catch (e) {
      setErr(e.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md" style={{ animation: 'var(--animate-fade-up)' }}>
        <Link to="/" className="inline-flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-brand-600 grid place-items-center text-white font-bold">H</div>
          <span className="text-base font-semibold text-gray-900">HireIQ</span>
        </Link>

        <div className="card p-8 shadow-sm">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Create your account</h1>
          <p className="text-gray-600 mt-1.5">Sign up as a jobseeker or a recruiter.</p>

          <form onSubmit={submit} className="mt-7 space-y-4">
            <div className="grid grid-cols-2 gap-2 p-1 rounded-lg bg-gray-100/70 border border-gray-200/70">
              <RoleBtn active={role === 'jobseeker'} onClick={() => setRole('jobseeker')} icon={<UserIcon />} label="Jobseeker" sub="Find work" />
              <RoleBtn active={role === 'recruiter'} onClick={() => setRole('recruiter')} icon={<BriefcaseIcon />} label="Recruiter" sub="Hire talent" />
            </div>

            <Field label="Full name"><input className="input" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" /></Field>
            <Field label="Email"><input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" /></Field>
            <Field label="Password"><input className="input" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" /></Field>

            {err && <div className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2.5">{err}</div>}

            <button className="btn btn-primary btn-lg w-full" disabled={loading}>
              {loading ? <Spinner /> : 'Create account'}
            </button>
          </form>
        </div>

        <p className="text-sm text-gray-600 mt-6 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-600 hover:text-brand-700 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return <label className="block"><span className="text-sm text-gray-700 mb-1.5 block font-medium">{label}</span>{children}</label>;
}

function RoleBtn({ active, onClick, icon, label, sub }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-start gap-0.5 px-3.5 py-2.5 rounded-md text-left transition-all ${
        active
          ? 'bg-white border border-gray-200 shadow-sm'
          : 'border border-transparent hover:bg-white/60'
      }`}
    >
      <div className="flex items-center gap-2">
        <span className={active ? 'text-brand-600' : 'text-gray-500'}>{icon}</span>
        <span className={`font-semibold text-sm ${active ? 'text-gray-900' : 'text-gray-700'}`}>{label}</span>
      </div>
      <span className={`text-[11px] ${active ? 'text-gray-500' : 'text-gray-400'} pl-6`}>{sub}</span>
    </button>
  );
}

function Spinner() { return <span className="inline-block w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />; }
function UserIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>; }
function BriefcaseIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>; }
