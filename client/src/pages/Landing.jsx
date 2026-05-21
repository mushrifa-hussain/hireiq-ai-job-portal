import React from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div>
      {/* === HERO === */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pb-16 md:pb-24" style={{ paddingTop: '120px' }}>
        {/* Soft purple glow behind the heading */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(ellipse 60% 45% at 50% 18%, rgba(167, 139, 250, 0.22) 0%, rgba(167, 139, 250, 0.08) 40%, transparent 75%)',
          }}
        />
        <div className="absolute inset-0 -z-10 bg-dots opacity-50 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_30%,transparent_75%)]" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          

          <h1 className="text-balance text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05] text-gray-900" style={{ animation: 'var(--animate-fade-up)', animationDelay: '0.05s' }}>
            Land your dream job <span className="text-brand-600">with AI</span> on your side.
          </h1>

          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed text-balance" style={{ animation: 'var(--animate-fade-up)', animationDelay: '0.1s' }}>
            HireIQ analyzes your resume against every job using AI. Get a precise match score, missing-skill insights, and tailored improvement tips that get you hired.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3" style={{ animation: 'var(--animate-fade-up)', animationDelay: '0.15s' }}>
            <Link to="/register" className="btn btn-primary btn-lg">
              Get started
              <ArrowIcon />
            </Link>
            <Link to="/jobs" className="btn btn-ghost btn-lg">Browse jobs</Link>
          </div>
        </div>
      </section>

      {/* === FEATURES === */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-28">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="pill pill-brand">Why HireIQ</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-gray-900 text-balance">
            Hiring that actually <span className="text-brand-600">understands you</span>.
          </h2>
          <p className="mt-4 text-gray-600 text-lg text-balance">
            A modern hiring platform built for jobseekers and recruiters. Real AI, real insights, zero noise.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          <Feature
            icon={<IconSparkle />}
            title="AI resume analysis"
            text="AI scans every resume against the job description and returns a precise 0–100 match score with extracted skills."
          />
          <Feature
            icon={<IconRing />}
            title="Skill gap insights"
            text="See exactly which required skills are missing — and tailored suggestions to close the gap fast."
          />
          <Feature
            icon={<IconRank />}
            title="Smart ranking"
            text="Recruiters get applicants automatically ranked by AI fit so the best candidates rise to the top."
          />
          <Feature
            icon={<IconShield />}
            title="Secure JWT auth"
            text="Role-based authentication keeps jobseeker and recruiter dashboards securely separated."
          />
          <Feature
            icon={<IconBolt />}
            title="Powerful filters"
            text="Search by location, job type, and required skills to find your perfect role in seconds."
          />
          <Feature
            icon={<IconChart />}
            title="Score history"
            text="Track every resume submission and watch your match scores improve over time."
          />
        </div>
      </section>

      {/* === HOW IT WORKS === */}
      <section className="bg-gray-50 border-y border-gray-200/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="pill pill-brand">How it works</span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-gray-900">From sign-up to interview</h2>
            <p className="mt-4 text-gray-600 text-lg">Three steps. That's it.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            <Step n="01" title="Sign up" text="Create a jobseeker or recruiter account. Free forever, no credit card." />
            <Step n="02" title="Upload resume" text="Drop your PDF resume into any job. Our AI analyzes it in seconds." />
            <Step n="03" title="Get matched" text="See your fit score, missing skills, and tailored improvement suggestions." />
          </div>
        </div>
      </section>

      {/* === CTA === */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="card px-8 py-14 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 text-balance">
            Ready to find your <span className="text-brand-600">match</span>?
          </h2>
          <p className="text-gray-600 mt-3 text-lg">Whether you're hiring or looking for your next role, HireIQ has you covered.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to="/register" className="btn btn-primary btn-lg">Create an account <ArrowIcon /></Link>
            <Link to="/jobs" className="btn btn-ghost btn-lg">Browse jobs</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Feature({ icon, title, text }) {
  return (
    <div className="card card-hover p-7">
      <div className="w-10 h-10 rounded-lg bg-brand-50 border border-brand-100 grid place-items-center text-brand-600 mb-5">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      <p className="text-gray-600 text-sm mt-2 leading-relaxed">{text}</p>
    </div>
  );
}

function Step({ n, title, text }) {
  return (
    <div className="card p-7">
      <div className="font-mono text-xs tracking-widest text-brand-600 font-semibold mb-3">STEP {n}</div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-gray-600 text-sm mt-2 leading-relaxed">{text}</p>
    </div>
  );
}

function ArrowIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>; }
function IconSparkle() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.5 5.5L20 10l-5.5 2.5L12 18l-2.5-5.5L4 10l5.5-2.5z" /></svg>; }
function IconRing() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 3a9 9 0 0 1 9 9" /></svg>; }
function IconRank() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="20" x2="6" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="18" y1="20" x2="18" y2="14" /></svg>; }
function IconShield() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6l-8-4z" /></svg>; }
function IconBolt() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>; }
function IconChart() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 17 9 11 13 15 21 7" /><polyline points="14 7 21 7 21 14" /></svg>; }
