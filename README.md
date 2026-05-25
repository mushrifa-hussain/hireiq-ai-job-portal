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
  <img src="https://github.com/user-attachments/assets/8a5c7348-2939-49f9-8d42-667fbeb66c3b" width="850">
</p>

## Sign Up Page

<p align="center">
  <img width="709" height="398" alt="image" src="https://github.com/user-attachments/assets/e7ec6bf0-2d45-4814-af81-8466009ce6fa" />
</p>

## Job Seeker Dashboard

<p align="center">
  <img src="https://github.com/user-attachments/assets/88ff376b-0bfe-45b4-9307-fd0a26c46c40" width="850">
</p>

## Browse Jobs and Smart Job Recommendation

<p align="center">
  <img src="https://github.com/user-attachments/assets/fb11037a-ed88-4ce3-bb5d-faff0d51f0b7" width="850">
</p>

## Resume Analysis

<p align="center">
  <img src="https://github.com/user-attachments/assets/09a323a0-6495-403d-9d36-a63420c63c41" width="850">
</p>

## Interview Preparation Page

<p align="center">
  <img src="https://github.com/user-attachments/assets/e108292c-93b0-4dae-a2f5-5962b1408bff" width="850">
</p>

## Recruiter Dashboard

<p align="center">
  <img src="https://github.com/user-attachments/assets/1430ac15-9824-4885-bd87-d2c9a113a3db" width="850">
</p>

## AI Chatbot

<p align="center">
  <img src="https://github.com/user-attachments/assets/d664ba10-e998-4f19-a801-e866b5858b63" width="850">
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
