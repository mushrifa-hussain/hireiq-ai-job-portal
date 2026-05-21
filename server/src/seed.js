require('dotenv').config();
const bcrypt = require('bcryptjs');
const prisma = require('./db');

async function main() {
  const password = await bcrypt.hash('demo1234', 10);

  const recruiter = await prisma.user.upsert({
    where: { email: 'recruiter@hireiq.dev' },
    update: {},
    create: {
      name: 'Sarah Recruiter',
      email: 'recruiter@hireiq.dev',
      password,
      role: 'recruiter',
    },
  });

  await prisma.user.upsert({
    where: { email: 'jobseeker@hireiq.dev' },
    update: {},
    create: {
      name: 'Alex Candidate',
      email: 'jobseeker@hireiq.dev',
      password,
      role: 'jobseeker',
    },
  });

  const seedJobs = [
    {
      title: 'Senior Frontend Engineer',
      company: 'Acme Labs',
      location: 'Remote',
      type: 'Full-time',
      salary: '₹20-30 LPA',
      description: 'Build delightful product experiences for millions of users using React and modern web tech.',
      requirements: '4+ years building production React apps\nExpertise in TypeScript and CSS\nExperience integrating REST APIs\nGood eye for UX and accessibility',
      skills: 'React, TypeScript, Tailwind, REST, Accessibility',
    },
    {
      title: 'Backend Engineer (Node.js)',
      company: 'Helix Cloud',
      location: 'Bengaluru',
      type: 'Full-time',
      salary: '₹15-25 LPA',
      description: 'Design scalable APIs and data pipelines for our distributed cloud platform.',
      requirements: '3+ years with Node.js\nStrong PostgreSQL skills\nExperience with Prisma or similar ORMs\nFamiliarity with cloud infrastructure (AWS or GCP)',
      skills: 'Node.js, PostgreSQL, Prisma, AWS, REST',
    },
    {
      title: 'AI/ML Intern',
      company: 'Cognivex',
      location: 'Hyderabad',
      type: 'Internship',
      salary: '₹40k/month',
      description: 'Work on retrieval-augmented generation and LLM tooling alongside our research team.',
      requirements: 'Strong Python skills\nExposure to PyTorch or TensorFlow\nUnderstanding of NLP fundamentals\nCurrent CS student',
      skills: 'Python, PyTorch, NLP, LLM, RAG',
    },
    {
      title: 'Full Stack Developer',
      company: 'Bluerise',
      location: 'Pune',
      type: 'Full-time',
      salary: '₹12-18 LPA',
      description: 'Own features end-to-end across our React frontend and Express backend.',
      requirements: '2+ years full stack experience\nReact + Node.js\nSQL/NoSQL\nExcellent communication',
      skills: 'React, Node.js, Express, MongoDB, JavaScript',
    },
    {
      title: 'DevOps Engineer',
      company: 'Stratos Systems',
      location: 'Remote',
      type: 'Contract',
      salary: '₹100/hr',
      description: 'Automate CI/CD, manage Kubernetes clusters, and optimize deployment workflows.',
      requirements: 'Solid Linux fundamentals\nKubernetes and Docker\nTerraform or Pulumi\nMonitoring with Prometheus/Grafana',
      skills: 'Kubernetes, Docker, Terraform, AWS, CI/CD',
    },
  ];

  for (const j of seedJobs) {
    const exists = await prisma.job.findFirst({
      where: { title: j.title, company: j.company },
    });
    if (!exists) {
      await prisma.job.create({ data: { ...j, recruiterId: recruiter.id } });
    }
  }

  const count = await prisma.job.count();
  console.log(`Seed complete. Total jobs: ${count}`);
  console.log('Demo accounts: recruiter@hireiq.dev / jobseeker@hireiq.dev (password: demo1234)');
}

main()
  .then(() => process.exit(0))
  .catch((e) => { console.error(e); process.exit(1); });
