import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-600 grid place-items-center text-white font-bold">H</div>
              <span className="text-base font-semibold tracking-tight text-gray-900">HireIQ</span>
            </div>
            <p className="mt-4 text-sm text-gray-600 max-w-sm leading-relaxed">
              Match jobseekers and recruiters with AI-powered resume analysis. Instant scores, skill gaps, and tailored improvement tips.
            </p>
          </div>
          <div className="md:col-span-2">
            <div className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-3">Product</div>
            <ul className="space-y-2 text-sm">
              <FootLink to="/jobs">Browse jobs</FootLink>
              <FootLink to="/register">Get started</FootLink>
              <FootLink to="/login">Sign in</FootLink>
            </ul>
          </div>
          <div className="md:col-span-2">
            <div className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-3">Recruiters</div>
            <ul className="space-y-2 text-sm">
              <FootLink to="/post-job">Post a job</FootLink>
              <FootLink to="/dashboard/recruiter">Dashboard</FootLink>
            </ul>
          </div>
          <div className="md:col-span-3">
            <div className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-3">Built with</div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>React 19 · Vite</li>
              <li>Express · Prisma 7</li>
              <li>PostgreSQL · JWT</li>
              <li>AI-powered analysis</li>
            </ul>
          </div>
        </div>

        <div className="divider my-8" />

        <div className="text-xs text-gray-500">
          © {new Date().getFullYear()} HireIQ
        </div>
      </div>
    </footer>
  );
}

function FootLink({ to, children }) {
  return <li><Link to={to} className="text-gray-600 hover:text-gray-900 transition-colors">{children}</Link></li>;
}
