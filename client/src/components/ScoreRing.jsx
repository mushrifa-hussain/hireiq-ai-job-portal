import React, { useEffect, useState } from 'react';

export default function ScoreRing({ score = 0, size = 140, stroke = 10, label = 'Match' }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const target = Math.max(0, Math.min(100, score || 0));
    const start = performance.now();
    const dur = 800;
    let raf;
    const step = (t) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const dash = (display / 100) * circ;

  const color = score >= 80
    ? '#059669'
    : score >= 60
    ? '#7c3aed'
    : score >= 40
    ? '#d97706'
    : '#dc2626';

  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#f1f3f7"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${dash} ${circ}`}
          style={{ transition: 'stroke 0.2s' }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="text-3xl font-bold tabular-nums text-gray-900 leading-none">{display}</div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-gray-500 mt-1.5 font-medium">{label}</div>
        </div>
      </div>
    </div>
  );
}
