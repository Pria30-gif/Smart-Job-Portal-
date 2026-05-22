import dotenv from 'dotenv';
dotenv.config({ encoding: 'utf16le' });
import db from './utils/db.js';
import bcrypt from 'bcryptjs';
import { Company } from './models/company.model.js';
import { Job } from './models/job.model.js';
import { Application } from './models/application.model.js';
import { User } from './models/usermodel.js';

await db();

let user = await User.findOne({ email: 'priyabuagde143@gmail.com' });
if (!user) {
  console.log('User not found, creating new user...');
  const hashedPassword = await bcrypt.hash('password123', 10);
  user = new User({
    fullname: 'Priya Buagde',
    email: 'priyabuagde143@gmail.com',
    password: hashedPassword,
    role: 'recruiter'
  });
  await user.save();
  console.log('User created:', user.fullname);
} else {
  console.log('User found:', user.fullname);
}

// Create more companies
const additionalCompaniesData = [
  {
    name: 'Meta',
    description: 'Social media and technology company',
    website: 'https://meta.com',
    location: 'Menlo Park, CA',
    logo: '',
    userId: user._id
  },
  {
    name: 'Netflix',
    description: 'Streaming entertainment company',
    website: 'https://netflix.com',
    location: 'Los Gatos, CA',
    logo: '',
    userId: user._id
  },
  {
    name: 'Tesla',
    description: 'Electric vehicle and clean energy company',
    website: 'https://tesla.com',
    location: 'Austin, TX',
    logo: '',
    userId: user._id
  },
  {
    name: 'Uber',
    description: 'Ride-sharing and delivery company',
    website: 'https://uber.com',
    location: 'San Francisco, CA',
    logo: '',
    userId: user._id
  },
  {
    name: 'Airbnb',
    description: 'Online marketplace for lodging',
    website: 'https://airbnb.com',
    location: 'San Francisco, CA',
    logo: '',
    userId: user._id
  }
];

const additionalCompanies = [];
for (const companyData of additionalCompaniesData) {
  const company = new Company(companyData);
  await company.save();
  additionalCompanies.push(company);
  console.log('Additional company created:', company.name);
}

// Get all companies
const allCompanies = await Company.find({});
console.log('Total companies now:', allCompanies.length);

// Create many more jobs with diverse data to ensure filters work
const moreJobsData = [
  // Delhi jobs
  {
    title: 'React Developer',
    description: 'Build modern web applications with React',
    requirements: ['React', 'JavaScript', 'CSS', 'HTML'],
    salary: '80000',
    location: 'Delhi',
    jobType: 'Full-time',
    experienceLevel: "2",
    position: 3,
    company: allCompanies[0]._id,
    created_by: user._id
  },
  {
    title: 'Data Scientist',
    description: 'Analyze data and build ML models',
    requirements: ['Python', 'Machine Learning', 'Pandas', 'Scikit-learn'],
    salary: '120000',
    location: 'Delhi',
    jobType: 'Full-time',
    experienceLevel: "4",
    position: 2,
    company: allCompanies[1]._id,
    created_by: user._id
  },
  // Mumbai jobs
  {
    title: 'Full Stack Developer',
    description: 'Develop end-to-end web applications',
    requirements: ['React', 'Node.js', 'MongoDB', 'Express'],
    salary: '100000',
    location: 'Mumbai',
    jobType: 'Full-time',
    experienceLevel: "3",
    position: 3,
    company: allCompanies[2]._id,
    created_by: user._id
  },
  {
    title: 'Python Developer',
    description: 'Build backend services with Python',
    requirements: ['Python', 'Django', 'PostgreSQL', 'REST APIs'],
    salary: '90000',
    location: 'Mumbai',
    jobType: 'Full-time',
    experienceLevel: "3",
    position: 2,
    company: allCompanies[3]._id,
    created_by: user._id
  },
  // Kolhapur jobs
  {
    title: 'Java Developer',
    description: 'Develop enterprise applications',
    requirements: ['Java', 'Spring Boot', 'MySQL', 'Microservices'],
    salary: '85000',
    location: 'Kolhapur',
    jobType: 'Full-time',
    experienceLevel: 3,
    position: 2,
    company: allCompanies[4]._id,
    created_by: user._id
  },
  // Pune jobs
  {
    title: 'Frontend Developer',
    description: 'Create beautiful user interfaces',
    requirements: ['React', 'TypeScript', 'Tailwind CSS', 'Figma'],
    salary: '75000',
    location: 'Pune',
    jobType: 'Full-time',
    experienceLevel: "2",
    position: 3,
    company: allCompanies[5]._id,
    created_by: user._id
  },
  {
    title: 'Backend Developer',
    description: 'Build robust backend systems',
    requirements: ['Node.js', 'Express', 'MongoDB', 'Redis'],
    salary: '95000',
    location: 'Pune',
    jobType: 'Full-time',
    experienceLevel: "4",
    position: 2,
    company: allCompanies[6]._id,
    created_by: user._id
  },
  // Bangalore jobs
  {
    title: 'Mobile App Developer',
    description: 'Create native mobile applications',
    requirements: ['React Native', 'iOS', 'Android', 'Firebase'],
    salary: '110000',
    location: 'Bangalore',
    jobType: 'Full-time',
    experienceLevel: "4",
    position: 2,
    company: allCompanies[7]._id,
    created_by: user._id
  },
  {
    title: 'DevOps Engineer',
    description: 'Manage infrastructure and deployments',
    requirements: ['AWS', 'Docker', 'Kubernetes', 'Jenkins'],
    salary: '130000',
    location: 'Bangalore',
    jobType: 'Full-time',
    experienceLevel: "5",
    position: 1,
    company: allCompanies[8]._id,
    created_by: user._id
  },
  // Hyderabad jobs
  {
    title: 'Machine Learning Engineer',
    description: 'Build and deploy ML models at scale',
    requirements: ['Python', 'TensorFlow', 'AWS', 'Docker'],
    salary: '140000',
    location: 'Hyderabad',
    jobType: 'Full-time',
    experienceLevel: "5",
    position: 1,
    company: allCompanies[9]._id,
    created_by: user._id
  },
  // Chennai jobs
  {
    title: 'QA Engineer',
    description: 'Ensure software quality and reliability',
    requirements: ['Selenium', 'Jest', 'Cypress', 'API Testing'],
    salary: '70000',
    location: 'Chennai',
    jobType: 'Contract',
    experienceLevel: "2",
    position: 2,
    company: allCompanies[0]._id,
    created_by: user._id
  },
  // Remote jobs
  {
    title: 'Technical Writer',
    description: 'Create technical documentation',
    requirements: ['Technical Writing', 'API Documentation', 'Markdown'],
    salary: '65000',
    location: 'Remote',
    jobType: 'Part-time',
    experienceLevel: "2",
    position: 1,
    company: allCompanies[1]._id,
    created_by: user._id
  },
  {
    title: 'Cloud Architect',
    description: 'Design and implement cloud solutions',
    requirements: ['AWS', 'Azure', 'Terraform', 'Kubernetes'],
    salary: '160000',
    location: 'Remote',
    jobType: 'Full-time',
    experienceLevel: "7",
    position: 1,
    company: allCompanies[2]._id,
    created_by: user._id
  },
  // Additional jobs for different salary ranges
  {
    title: 'Junior Developer',
    description: 'Entry level development position',
    requirements: ['JavaScript', 'HTML', 'CSS', 'Git'],
    salary: '45000',
    location: 'Delhi',
    jobType: 'Full-time',
    experienceLevel: "1",
    position: 5,
    company: allCompanies[3]._id,
    created_by: user._id
  },
  {
    title: 'Senior Full Stack Developer',
    description: 'Lead development team',
    requirements: ['React', 'Node.js', 'MongoDB', 'Leadership'],
    salary: '180000',
    location: 'Bangalore',
    jobType: 'Full-time',
    experienceLevel: 8,
    position: 1,
    company: allCompanies[4]._id,
    created_by: user._id
  }
];

const moreJobs = [];
for (const jobData of moreJobsData) {
  const job = new Job(jobData);
  await job.save();
  moreJobs.push(job);
  console.log('Additional job created:', job.title);
}

// Get all jobs
const allJobs = await Job.find({});
console.log('Total jobs now:', allJobs.length);

// Create many more applications with varied statuses
const moreApplicationsData = [
  { job: allJobs[1]._id, applicant: user._id, status: 'pending' },
  { job: allJobs[2]._id, applicant: user._id, status: 'pending' },
  { job: allJobs[3]._id, applicant: user._id, status: 'accepted' },
  { job: allJobs[4]._id, applicant: user._id, status: 'rejected' },
  { job: allJobs[5]._id, applicant: user._id, status: 'pending' },
  { job: allJobs[6]._id, applicant: user._id, status: 'accepted' },
  { job: allJobs[7]._id, applicant: user._id, status: 'pending' },
  { job: allJobs[8]._id, applicant: user._id, status: 'rejected' },
  { job: allJobs[9]._id, applicant: user._id, status: 'pending' },
  { job: allJobs[10]._id, applicant: user._id, status: 'accepted' },
  { job: allJobs[11]._id, applicant: user._id, status: 'pending' },
  { job: allJobs[12]._id, applicant: user._id, status: 'rejected' },
  { job: allJobs[13]._id, applicant: user._id, status: 'pending' },
  { job: allJobs[14]._id, applicant: user._id, status: 'accepted' },
  { job: allJobs[15]._id, applicant: user._id, status: 'pending' }
];

for (const applicationData of moreApplicationsData) {
  const application = new Application(applicationData);
  await application.save();
  console.log('Additional application created for job:', allJobs.find(j => j._id.equals(applicationData.job)).title, 'with status:', applicationData.status);
}

console.log('Extended sample data creation completed!');
process.exit(0);
