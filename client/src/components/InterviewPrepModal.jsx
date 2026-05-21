import React, { useEffect, useState } from 'react';
import api from '../api.js';

export default function InterviewPrepModal({ jobId, jobTitle, jobCompany, onClose }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    let cancelled = false;
    api.post(`/interview-questions/${jobId}`)
      .then(({ data }) => { if (!cancelled) setData(data); })
      .catch((e) => { if (!cancelled) setErr(e.response?.data?.error || 'Could not generate questions'); })
      .finally(() => { if (!cancelled) setLoading(false); });

    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      cancelled = true;
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [jobId, onClose]);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm"
      style={{ animation: 'var(--animate-fade-in)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden" style={{ animation: 'var(--animate-fade-up)' }}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2">
              <span className="pill pill-brand"><SparkleIcon /> Interview prep</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-gray-900 mt-2 truncate">{jobTitle}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{jobCompany} · AI-generated practice questions</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-gray-700 p-2 -m-2 transition-colors flex-shrink-0">
            <CloseIcon />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6" style={{ background: '#f0f0f8' }}>
          {loading && <Skeleton />}
          {err && (
            <div className="p-6 text-center">
              <div className="w-12 h-12 mx-auto rounded-xl bg-rose-50 border border-rose-200 grid place-items-center mb-3 text-rose-600">
                <AlertIcon />
              </div>
              <p className="text-gray-900 font-medium">{err}</p>
              <p className="text-gray-500 text-sm mt-1">Close this and try again in a minute.</p>
            </div>
          )}
          {!loading && !err && data && (
            <div className="space-y-7">
              <CategorySection
                title="Technical questions"
                accent="brand"
                count={data.questions.technical?.length || 0}
                questions={data.questions.technical || []}
              />
              <CategorySection
                title="HR questions"
                accent="emerald"
                count={data.questions.hr?.length || 0}
                questions={data.questions.hr || []}
              />
              <CategorySection
                title="Situational questions"
                accent="amber"
                count={data.questions.situational?.length || 0}
                questions={data.questions.situational || []}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-200 bg-white text-xs text-gray-500 text-center">
          AI-generated. Use as practice — actual interviews will vary.
        </div>
      </div>
    </div>
  );
}

const ACCENT = {
  brand: { dot: 'bg-brand-500', label: 'text-brand-700', bg: 'bg-brand-50', border: 'border-brand-100' },
  emerald: { dot: 'bg-emerald-500', label: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  amber: { dot: 'bg-amber-500', label: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-100' },
};

function CategorySection({ title, accent, count, questions }) {
  const a = ACCENT[accent] || ACCENT.brand;
  if (!questions.length) return null;
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className={`w-2 h-2 rounded-full ${a.dot}`} />
        <h3 className={`text-xs uppercase tracking-wider font-semibold ${a.label}`}>{title}</h3>
        <span className="text-xs text-gray-400">· {count}</span>
      </div>
      <div className="space-y-2.5">
        {questions.map((q, i) => (
          <div key={i} className={`p-4 rounded-xl border ${a.border} bg-white flex gap-3`}>
            <span className={`flex-shrink-0 w-6 h-6 rounded-full ${a.bg} ${a.border} border ${a.label} grid place-items-center text-xs font-bold`}>
              {i + 1}
            </span>
            <p className="text-sm text-gray-800 leading-relaxed pt-0.5">{q}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-6">
      {[3, 2, 2].map((n, idx) => (
        <div key={idx}>
          <div className="h-3 w-32 bg-gray-200 rounded animate-pulse mb-3" />
          <div className="space-y-2">
            {[...Array(n)].map((_, i) => (
              <div key={i} className="h-16 bg-white border border-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function SparkleIcon() { return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.5 5.5L20 10l-5.5 2.5L12 18l-2.5-5.5L4 10l5.5-2.5z" /></svg>; }
function CloseIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>; }
function AlertIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>; }
