import dotenv from 'dotenv';
dotenv.config({ encoding: 'utf16le' });
import db from './utils/db.js';
import bcrypt from 'bcryptjs';
import { Company } from './models/company.model.js';
import { Job } from './models/job.model.js';
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

// Get all existing companies
let companies = await Company.find({});
if (companies.length === 0) {
  console.log('No companies found, creating sample companies...');
  const sampleCompaniesData = [
    { name: 'Google', description: 'Search engine company', website: 'https://google.com', location: 'Mountain View, CA', logo: '', userId: user._id },
    { name: 'Microsoft', description: 'Software company', website: 'https://microsoft.com', location: 'Redmond, WA', logo: '', userId: user._id },
    { name: 'Amazon', description: 'E-commerce company', website: 'https://amazon.com', location: 'Seattle, WA', logo: '', userId: user._id },
    { name: 'Apple', description: 'Technology company', website: 'https://apple.com', location: 'Cupertino, CA', logo: '', userId: user._id },
    { name: 'Facebook', description: 'Social media company', website: 'https://facebook.com', location: 'Menlo Park, CA', logo: '', userId: user._id },
    { name: 'Twitter', description: 'Social networking company', website: 'https://twitter.com', location: 'San Francisco, CA', logo: '', userId: user._id },
    { name: 'LinkedIn', description: 'Professional networking company', website: 'https://linkedin.com', location: 'Sunnyvale, CA', logo: '', userId: user._id },
    { name: 'Netflix', description: 'Streaming service', website: 'https://netflix.com', location: 'Los Gatos, CA', logo: '', userId: user._id },
    { name: 'Spotify', description: 'Music streaming company', website: 'https://spotify.com', location: 'Stockholm, Sweden', logo: '', userId: user._id },
    { name: 'Adobe', description: 'Software company', website: 'https://adobe.com', location: 'San Jose, CA', logo: '', userId: user._id },
    { name: 'Salesforce', description: 'CRM company', website: 'https://salesforce.com', location: 'San Francisco, CA', logo: '', userId: user._id },
    { name: 'Oracle', description: 'Database company', website: 'https://oracle.com', location: 'Redwood City, CA', logo: '', userId: user._id },
    { name: 'IBM', description: 'Technology company', website: 'https://ibm.com', location: 'Armonk, NY', logo: '', userId: user._id },
    { name: 'Intel', description: 'Semiconductor company', website: 'https://intel.com', location: 'Santa Clara, CA', logo: '', userId: user._id },
    { name: 'Cisco', description: 'Networking company', website: 'https://cisco.com', location: 'San Jose, CA', logo: '', userId: user._id }
  ];
  for (const companyData of sampleCompaniesData) {
    const company = new Company(companyData);
    await company.save();
    companies.push(company);
    console.log('Sample company created:', company.name);
  }
} else {
  console.log('Existing companies:', companies.map(c => c.name));
}

// Create jobs related to SMART-JOB-PORTAL project (MERN stack job portal)
const projectJobsData = [
  // Frontend jobs
  {
    title: 'React Frontend Developer',
    description: 'Develop modern user interfaces for job portal using React, Redux, and Tailwind CSS',
    requirements: ['React', 'JavaScript', 'Redux', 'Tailwind CSS', 'HTML', 'CSS'],
    salary: '85000',
    location: 'Remote',
    jobType: 'Full-time',
    experienceLevel: "2",
    position: 3,
    company: companies[0]._id,
    created_by: user._id
  },
  {
    title: 'Frontend Developer - MERN Stack',
    description: 'Build responsive frontend components for job portal application',
    requirements: ['React', 'JavaScript', 'HTML', 'CSS', 'Responsive Design'],
    salary: '80000',
    location: 'Delhi',
    jobType: 'Full-time',
    experienceLevel: "2",
    position: 2,
    company: companies[1]._id,
    created_by: user._id
  },
  // Backend jobs
  {
    title: 'Node.js Backend Developer',
    description: 'Develop robust backend APIs for job portal using Node.js and Express',
    requirements: ['Node.js', 'Express', 'MongoDB', 'REST APIs', 'JWT'],
    salary: '90000',
    location: 'Mumbai',
    jobType: 'Full-time',
    experienceLevel: "3",
    position: 2,
    company: companies[2]._id,
    created_by: user._id
  },
  {
    title: 'Backend Developer - Express & MongoDB',
    description: 'Build scalable backend services for job management system',
    requirements: ['Node.js', 'Express', 'MongoDB', 'Mongoose', 'Authentication'],
    salary: '95000',
    location: 'Bangalore',
    jobType: 'Full-time',
    experienceLevel: "3",
    position: 1,
    company: companies[3]._id,
    created_by: user._id
  },
  // Full Stack jobs
  {
    title: 'Full Stack Developer - MERN',
    description: 'Develop complete job portal features using MERN stack',
    requirements: ['React', 'Node.js', 'MongoDB', 'Express', 'JavaScript'],
    salary: '110000',
    location: 'Pune',
    jobType: 'Full-time',
    experienceLevel: "4",
    position: 2,
    company: companies[4]._id,
    created_by: user._id
  },
  {
    title: 'MERN Stack Developer',
    description: 'Build end-to-end job portal functionality',
    requirements: ['MongoDB', 'Express', 'React', 'Node.js', 'Redux'],
    salary: '105000',
    location: 'Hyderabad',
    jobType: 'Full-time',
    experienceLevel: "3",
    position: 3,
    company: companies[5]._id,
    created_by: user._id
  },
  // AI/ML jobs (since project has ML components)
  {
    title: 'AI/ML Engineer - Salary Prediction',
    description: 'Develop machine learning models for salary prediction in job portal',
    requirements: ['Python', 'Machine Learning', 'TensorFlow', 'Scikit-learn', 'Data Analysis'],
    salary: '130000',
    location: 'Chennai',
    jobType: 'Full-time',
    experienceLevel: "4",
    position: 1,
    company: companies[6]._id,
    created_by: user._id
  },
  {
    title: 'Data Scientist - Job Analytics',
    description: 'Analyze job market data and build predictive models',
    requirements: ['Python', 'Pandas', 'NumPy', 'Machine Learning', 'Data Visualization'],
    salary: '125000',
    location: 'Remote',
    jobType: 'Full-time',
    experienceLevel: "5",
    position: 1,
    company: companies[7]._id,
    created_by: user._id
  },
  // DevOps jobs
  {
    title: 'DevOps Engineer',
    description: 'Manage deployment and infrastructure for job portal application',
    requirements: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Monitoring'],
    salary: '115000',
    location: 'Bangalore',
    jobType: 'Full-time',
    experienceLevel: "4",
    position: 1,
    company: companies[8]._id,
    created_by: user._id
  },
  // QA jobs
  {
    title: 'QA Engineer - Web Applications',
    description: 'Test and ensure quality of job portal web application',
    requirements: ['Selenium', 'Jest', 'API Testing', 'Manual Testing', 'Bug Tracking'],
    salary: '70000',
    location: 'Delhi',
    jobType: 'Full-time',
    experienceLevel: 2,
    position: 2,
    company: companies[9]._id,
    created_by: user._id
  },
  // Additional relevant jobs
  {
    title: 'UI/UX Designer - Job Portal',
    description: 'Design intuitive user interfaces for job seekers and employers',
    requirements: ['Figma', 'Adobe XD', 'User Research', 'Prototyping', 'Design Systems'],
    salary: '85000',
    location: 'Mumbai',
    jobType: 'Full-time',
    experienceLevel: "3",
    position: 1,
    company: companies[0]._id,
    created_by: user._id
  },
  {
    title: 'Mobile App Developer - React Native',
    description: 'Develop mobile version of job portal using React Native',
    requirements: ['React Native', 'JavaScript', 'iOS', 'Android', 'Firebase'],
    salary: '100000',
    location: 'Pune',
    jobType: 'Full-time',
    experienceLevel: "3",
    position: 2,
    company: companies[1]._id,
    created_by: user._id
  },
  {
    title: 'Technical Writer - API Documentation',
    description: 'Create comprehensive documentation for job portal APIs',
    requirements: ['Technical Writing', 'API Documentation', 'Markdown', 'Postman'],
    salary: '65000',
    location: 'Remote',
    jobType: 'Contract',
    experienceLevel: "2",
    position: 1,
    company: companies[2]._id,
    created_by: user._id
  },
  {
    title: 'Security Engineer - Web Applications',
    description: 'Implement security measures for job portal platform',
    requirements: ['Cybersecurity', 'OWASP', 'Authentication', 'Encryption', 'Penetration Testing'],
    salary: '120000',
    location: 'Hyderabad',
    jobType: 'Full-time',
    experienceLevel: "4",
    position: 1,
    company: companies[3]._id,
    created_by: user._id
  },
  {
    title: 'Database Administrator - MongoDB',
    description: 'Manage and optimize MongoDB databases for job portal',
    requirements: ['MongoDB', 'Database Design', 'Performance Tuning', 'Backup & Recovery'],
    salary: '95000',
    location: 'Chennai',
    jobType: 'Full-time',
    experienceLevel: "3",
    position: 1,
    company: companies[4]._id,
    created_by: user._id
  },
  // Additional jobs
  {
    title: 'Full Stack MERN Developer',
    description: 'Develop end-to-end solutions for job portal using MERN stack',
    requirements: ['React', 'Node.js', 'MongoDB', 'Express', 'JavaScript'],
    salary: '95000',
    location: 'Bangalore',
    jobType: 'Full-time',
    experienceLevel: 3,
    position: 2,
    company: companies[5]._id,
    created_by: user._id
  },
  {
    title: 'AI/ML Engineer for Job Matching',
    description: 'Implement AI algorithms for matching candidates to jobs',
    requirements: ['Python', 'Machine Learning', 'NLP', 'TensorFlow', 'Data Analysis'],
    salary: '120000',
    location: 'Remote',
    jobType: 'Full-time',
    experienceLevel: 4,
    position: 1,
    company: companies[6]._id,
    created_by: user._id
  },
  {
    title: 'Database Administrator - MongoDB',
    description: 'Manage and optimize MongoDB databases for the job portal',
    requirements: ['MongoDB', 'Database Administration', 'Indexing', 'Performance Tuning'],
    salary: '85000',
    location: 'Pune',
    jobType: 'Full-time',
    experienceLevel: 3,
    position: 1,
    company: companies[7]._id,
    created_by: user._id
  },
  {
    title: 'Cybersecurity Specialist',
    description: 'Ensure security of the job portal application',
    requirements: ['Cybersecurity', 'Encryption', 'Penetration Testing', 'OWASP'],
    salary: '100000',
    location: 'Hyderabad',
    jobType: 'Full-time',
    experienceLevel: 4,
    position: 1,
    company: companies[8]._id,
    created_by: user._id
  },
  {
    title: 'Cloud Engineer - AWS',
    description: 'Deploy and manage cloud infrastructure for the job portal',
    requirements: ['AWS', 'Cloud Computing', 'Docker', 'Kubernetes', 'CI/CD'],
    salary: '110000',
    location: 'Chennai',
    jobType: 'Full-time',
    experienceLevel: "4",
    position: 1,
    company: companies[9]._id,
    created_by: user._id
  },
  {
    title: 'Blockchain Developer',
    description: 'Develop blockchain solutions for secure job transactions',
    requirements: ['Blockchain', 'Ethereum', 'Smart Contracts', 'Solidity', 'Web3'],
    salary: '130000',
    location: 'Remote',
    jobType: 'Full-time',
    experienceLevel: 4,
    position: 1,
    company: companies[10]._id,
    created_by: user._id
  },
  {
    title: 'Product Manager - Job Portal',
    description: 'Manage product development for the job portal platform',
    requirements: ['Product Management', 'Agile', 'User Research', 'Analytics', 'Leadership'],
    salary: '120000',
    location: 'San Francisco',
    jobType: 'Full-time',
    experienceLevel: 5,
    position: 1,
    company: companies[11]._id,
    created_by: user._id
  },
  {
    title: 'Data Analyst - Job Market Insights',
    description: 'Analyze job market data to provide insights for the portal',
    requirements: ['Data Analysis', 'SQL', 'Excel', 'Tableau', 'Statistics'],
    salary: '75000',
    location: 'New York',
    jobType: 'Full-time',
    experienceLevel: 2,
    position: 2,
    company: companies[12]._id,
    created_by: user._id
  },
  {
    title: 'UX Researcher',
    description: 'Conduct user research to improve the job portal experience',
    requirements: ['User Research', 'Usability Testing', 'Surveys', 'Analytics', 'Design Thinking'],
    salary: '85000',
    location: 'Austin',
    jobType: 'Contract',
    experienceLevel: 3,
    position: 1,
    company: companies[13]._id,
    created_by: user._id
  },
  {
    title: 'DevOps Specialist - CI/CD',
    description: 'Implement CI/CD pipelines for the job portal',
    requirements: ['Jenkins', 'GitLab CI', 'Docker', 'Kubernetes', 'Automation'],
    salary: '100000',
    location: 'Seattle',
    jobType: 'Full-time',
    experienceLevel: 4,
    position: 1,
    company: companies[14]._id,
    created_by: user._id  },
  // Additional new jobs
  {
    title: 'Blockchain Developer',
    description: 'Develop blockchain solutions for secure job portal transactions',
    requirements: ['Blockchain', 'Ethereum', 'Smart Contracts', 'Solidity', 'Web3'],
    salary: '130000',
    location: 'Remote',
    jobType: 'Full-time',
    experienceLevel: 5,
    position: 1,
    company: companies[10]._id,
    created_by: user._id
  },
  {
    title: 'Product Manager - Job Portal',
    description: 'Manage product development for the job portal application',
    requirements: ['Product Management', 'Agile', 'User Research', 'Roadmapping', 'Analytics'],
    salary: '115000',
    location: 'New York',
    jobType: 'Full-time',
    experienceLevel: 4,
    position: 1,
    company: companies[11]._id,
    created_by: user._id
  },
  {
    title: 'Game Developer - Unity',
    description: 'Create interactive games for job portal engagement',
    requirements: ['Unity', 'C#', 'Game Development', '3D Modeling', 'Animation'],
    salary: '95000',
    location: 'Los Angeles',
    jobType: 'Full-time',
    experienceLevel: 3,
    position: 2,
    company: companies[12]._id,
    created_by: user._id
  },
  {
    title: 'Data Engineer',
    description: 'Build data pipelines for job analytics',
    requirements: ['Python', 'SQL', 'ETL', 'Apache Spark', 'Big Data'],
    salary: '105000',
    location: 'Seattle',
    jobType: 'Full-time',
    experienceLevel: 4,
    position: 1,
    company: companies[13]._id,
    created_by: user._id
  },
  {
    title: 'UX Researcher',
    description: 'Conduct user research for job portal improvements',
    requirements: ['User Research', 'Usability Testing', 'Survey Design', 'Analytics', 'Prototyping'],
    salary: '90000',
    location: 'San Francisco',
    jobType: 'Full-time',
    experienceLevel: 3,
    position: 1,
    company: companies[14]._id,
    created_by: user._id  },
  {
    title: 'Software Architect',
    description: 'Design software architecture for scalable job portal',
    requirements: ['System Design', 'Microservices', 'Cloud Architecture', 'Scalability', 'Leadership'],
    salary: '140000',
    location: 'Remote',
    jobType: 'Full-time',
    experienceLevel: 7,
    position: 1,
    company: companies[0]._id,
    created_by: user._id  },
  {
    title: 'Marketing Manager',
    description: 'Manage marketing campaigns for job portal growth',
    requirements: ['Digital Marketing', 'SEO', 'Content Strategy', 'Analytics', 'Campaign Management'],
    salary: '95000',
    location: 'New York',
    jobType: 'Full-time',
    experienceLevel: 4,
    position: 1,
    company: companies[1]._id,
    created_by: user._id  }
];

const projectJobs = [];
for (const jobData of projectJobsData) {
  const job = new Job(jobData);
  await job.save();
  projectJobs.push(job);
  console.log('Project job created:', job.title);
}

// Get all jobs
const allJobs = await Job.find({});
console.log('Total jobs now:', allJobs.length);

console.log('Project-related jobs creation completed!');
process.exit(0);
