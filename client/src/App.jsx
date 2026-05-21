import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ChatWidget from './components/ChatWidget.jsx';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Jobs from './pages/Jobs.jsx';
import JobDetail from './pages/JobDetail.jsx';
import PostJob from './pages/PostJob.jsx';
import JobseekerDashboard from './pages/JobseekerDashboard.jsx';
import RecruiterDashboard from './pages/RecruiterDashboard.jsx';
import JobApplicants from './pages/JobApplicants.jsx';
import { useAuth } from './context/AuthContext.jsx';

function Protected({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const location = useLocation();
  const hideChrome = ['/login', '/register'].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col text-gray-900">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/post-job" element={<Protected role="recruiter"><PostJob /></Protected>} />
          <Route path="/dashboard/jobseeker" element={<Protected role="jobseeker"><JobseekerDashboard /></Protected>} />
          <Route path="/dashboard/recruiter" element={<Protected role="recruiter"><RecruiterDashboard /></Protected>} />
          <Route path="/jobs/:id/applicants" element={<Protected role="recruiter"><JobApplicants /></Protected>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!hideChrome && <Footer />}
      <ChatWidget />
    </div>
  );
}
