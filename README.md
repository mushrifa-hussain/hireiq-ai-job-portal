# HireIQ – AI-Powered Job Portal 🚀

HireIQ is a full-stack AI-powered job portal designed to streamline the hiring process for both job seekers and recruiters. The platform combines modern web development with intelligent resume analysis to provide smarter job matching and recruitment workflows.

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based Login & Registration
- Role-based access (Job Seeker / Recruiter)
- Protected routes and persistent sessions
- Secure password hashing using bcrypt

### 👨‍💼 Job Seeker Features
- Browse and filter job listings
- Apply for jobs using PDF resumes
- AI-powered resume analysis
- Match score, missing skills, and improvement suggestions
- Application tracking dashboard
- Withdraw applications
- AI-generated interview preparation questions

### 🏢 Recruiter Features
- Post and manage job listings
- View applicants ranked by AI score
- Accept or reject applications
- View uploaded resumes securely
- Analyze applicant skills and resume insights

### 🤖 HireIQ Assistant
- AI-powered chatbot for career guidance
- Multi-turn conversation support
- Real-time job recommendations
- Floating responsive chat interface

### 🎨 UI & UX
- Responsive modern UI
- Tailwind CSS design system
- Interactive dashboards
- Animated score indicators
- Skeleton loaders and empty states

---

# 📸 Screenshots

## Landing Page

<p align="center">
  <img width="850" src="https://github.com/user-attachments/assets/bc928684-f363-48f5-99f1-c9895757b3bb" />
</p>

## Sign Up Page

<p align="center">
  <img src="https://github.com/user-attachments/assets/0203f3b0-3ede-4d6d-94d4-4f50e316f3d5" width="850">
</p>

## Job Seeker Dashboard

<p align="center">
  <img src="https://github.com/user-attachments/assets/a1865f95-7d93-4d2c-adf5-65c146adcc2c" width="850">
</p>

## Browse Jobs and Smart Job Recommendation

<p align="center">
  <img src="https://github.com/user-attachments/assets/794054fe-5b62-456b-bcf3-be6865da024f" width="850">
</p>

## Resume Analysis

<p align="center">
  <img src="https://github.com/user-attachments/assets/a5d935da-8607-4fbb-9863-6d1b81cb1edb" width="850">
</p>

## Interview Preparation Page

<p align="center">
  <img src="https://github.com/user-attachments/assets/859fab03-1431-4fcf-a2c5-7ceaafaaf535" width="850">
</p>

## Recruiter Dashboard

<p align="center">
  <img src="https://github.com/user-attachments/assets/7899294f-2449-4f23-bf5d-8e3ee28dc335" width="850">
</p>

## AI Chatbot

<p align="center">
  <img src="https://github.com/user-attachments/assets/aeee191e-2bbe-4ec5-a4f7-62df6b5da8fe" width="850">
</p>

---

# 🛠️ Technologies Used

## Frontend
- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Axios

## Backend
- Node.js
- Express.js
- JWT Authentication
- Multer
- bcryptjs

## Database & ORM
- PostgreSQL
- Prisma ORM

## AI & Machine Learning
- LLM Integration
- Resume Analysis
- Interview Question Generation

---

# 🚀 Installation

## Clone the Repository

```bash
git clone https://github.com/your-username/hireiq-ai-job-portal.git
cd hireiq-ai-job-portal
```

## Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside the server folder:

```env
DATABASE_URL=your_postgresql_database_url
JWT_SECRET=your_jwt_secret
GOOGLE_API_KEY=your_api_key
```

Run backend:

```bash
npm start
```

## Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

# 📌 Future Improvements

- Resume PDF preview enhancements
- Recruiter analytics dashboard
- Email notifications
- Advanced AI-based recommendations
- Deployment & cloud hosting

---

# 👩‍💻 Author

**Mushrifa Hussain**
- GitHub: https://github.com/mushrifa-hussain
- LinkedIn: https://linkedin.com/in/mushrifa-hussain
