import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data.token, data.user);
      navigate(data.user.role === 'recruiter' ? '/dashboard/recruiter' : '/dashboard/jobseeker');
    } catch (e) {
      setErr(e.response?.data?.error || 'Login failed');
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
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Welcome back</h1>
          <p className="text-gray-600 mt-1.5">Sign in to your HireIQ account.</p>

          <form onSubmit={submit} className="mt-7 space-y-4">
            <Field label="Email">
              <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" autoFocus />
            </Field>
            <Field label="Password">
              <input className="input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </Field>
            {err && <ErrBanner>{err}</ErrBanner>}
            <button className="btn btn-primary btn-lg w-full" disabled={loading}>
              {loading ? <Spinner /> : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-sm text-gray-600 mt-6 text-center">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-600 hover:text-brand-700 font-medium">Create one</Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-sm text-gray-700 mb-1.5 block font-medium">{label}</span>
      {children}
    </label>
  );
}

function ErrBanner({ children }) {
  return (
    <div className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2.5 flex items-center gap-2">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
      {children}
    </div>
  );
}

function Spinner() {
  return <span className="inline-block w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />;
}
