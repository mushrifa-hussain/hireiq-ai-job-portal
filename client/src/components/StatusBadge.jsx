import React from 'react';

const STATUS = {
  pending: { className: 'pill-amber', label: 'Pending' },
  accepted: { className: 'pill-emerald', label: 'Accepted' },
  rejected: { className: 'pill-rose', label: 'Rejected' },
};

export default function StatusBadge({ status }) {
  const s = STATUS[status] || STATUS.pending;
  return (
    <span className={`pill ${s.className}`}>
      {status === 'accepted' && <CheckIcon />}
      {status === 'rejected' && <XIcon />}
      {status === 'pending' && <DotIcon />}
      {s.label}
    </span>
  );
}

function CheckIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function XIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
function DotIcon() {
  return <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />;
}
