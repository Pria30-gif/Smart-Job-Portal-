import dotenv from 'dotenv';
dotenv.config({ encoding: 'utf16le' });
import db from './utils/db.js';
import bcrypt from 'bcryptjs';
import { Company } from './models/company.model.js';
import { Job } from './models/job.model.js';
import { Application } from './models/application.model.js';
import { User } from './models/usermodel.js';

await db();

try {
  const user = await User.findOne({ email: 'priyabuagde143@gmail.com' });
  console.log('User found:', user ? user.fullname : 'Not found');

  // Create more companies
  /*
  const companiesData = [
    {
      name: 'Google',
      description: 'Technology company',
      website: 'https://google.com',
      location: 'Mountain View, CA',
      logo: '',
      userId: user._id
    },
    {
      name: 'Microsoft',
      description: 'Software company',
      website: 'https://microsoft.com',
      location: 'Redmond, WA',
      logo: '',
      userId: user._id
    },
    {
      name: 'Amazon',
      description: 'E-commerce company',
      website: 'https://amazon.com',
      location: 'Seattle, WA',
      logo: '',
      userId: user._id
    },
    {
      name: 'Apple',
      description: 'Consumer electronics company',
      website: 'https://apple.com',
      location: 'Cupertino, CA',
      logo: '',
      userId: user._id
    }
  ];

  const companies = [];
  for (const companyData of companiesData) {
    const company = new Company(companyData);
    await company.save();
    companies.push(company);
    console.log('Company created:', company.name);
  }
  */

  // Create sample users with skills
  const usersData = [
    {
      fullname: 'John Doe',
      email: 'john@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'Student',
      profile: {
        skills: ['React', 'JavaScript', 'Node.js']
      }
    },
    {
      fullname: 'Jane Smith',
      email: 'jane@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'Student',
      profile: {
        skills: ['Python', 'Data Science', 'Machine Learning']
      }
    },
    {
      fullname: 'Bob Johnson',
      email: 'bob@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'Student',
      profile: {
        skills: ['Java', 'Spring', 'SQL']
      }
    }
  ];

  const users = [];
  for (const userData of usersData) {
    const user = new User(userData);
    await user.save();
    users.push(user);
    console.log('User created:', user.fullname);
  }

  // Create more jobs
  /*
  const jobsData = [
    {
      title: 'Frontend Developer',
      description: 'Develop user interfaces using React',
      requirements: ['React', 'JavaScript', 'CSS'],
      salary: '90000',
      location: 'Remote',
      jobType: 'Full-time',
      experienceLevel: 3,
      position: 2,
      company: companies[0]._id,
      created_by: user._id
    },
    {
      title: 'Backend Developer',
      description: 'Build scalable server-side applications',
      requirements: ['Node.js', 'MongoDB', 'Express'],
      salary: '95000',
      location: 'Hybrid',
      jobType: 'Full-time',
      experienceLevel: 4,
      position: 1,
      company: companies[1]._id,
      created_by: user._id
    },
    {
      title: 'Data Scientist',
      description: 'Analyze data and build ML models',
      requirements: ['Python', 'TensorFlow', 'SQL'],
      salary: '110000',
      location: 'On-site',
      jobType: 'Full-time',
      experienceLevel: 5,
      position: 1,
      company: companies[2]._id,
      created_by: user._id
    },
    {
      title: 'UI/UX Designer',
      description: 'Design beautiful user experiences',
      requirements: ['Figma', 'Adobe XD', 'Sketch'],
      salary: '85000',
      location: 'Remote',
      jobType: 'Contract',
      experienceLevel: 3,
      position: 1,
      company: companies[3]._id,
      created_by: user._id
    },
    {
      title: 'DevOps Engineer',
      description: 'Manage infrastructure and deployments',
      requirements: ['AWS', 'Docker', 'Kubernetes'],
      salary: '105000',
      location: 'Hybrid',
      jobType: 'Full-time',
      experienceLevel: 4,
      position: 1,
      company: companies[0]._id,
      created_by: user._id
    }
  ];

  */

  /*
  const jobs = [];
  for (const jobData of jobsData) {
    const job = new Job(jobData);
    await job.save();
    jobs.push(job);
    console.log('Job created:', job.title);
  }

  // Create applications for different jobs
  const applicationsData = [
    { job: jobs[0]._id, applicant: user._id, status: 'pending' },
    { job: jobs[1]._id, applicant: user._id, status: 'accepted' },
    { job: jobs[2]._id, applicant: user._id, status: 'rejected' },
    { job: jobs[3]._id, applicant: user._id, status: 'pending' }
  ];

  for (const applicationData of applicationsData) {
    const application = new Application(applicationData);
    await application.save();
    console.log('Application created for job:', jobs.find(j => j._id.equals(applicationData.job)).title, 'with status:', applicationData.status);
  }
  */

  console.log('Sample data creation completed!');
  process.exit(0);
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}
