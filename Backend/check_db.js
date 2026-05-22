import dotenv from 'dotenv';
dotenv.config();
import db from './config/db.js';
import { Job } from './models/job.model.js';
import { Application } from './models/application.model.js';
import { User } from './models/usermodel.js';
import { Company } from './models/company.model.js';

await db();

console.log('Checking database...');

// Check total jobs
const jobs = await Job.find({}).populate('company').populate('created_by');
console.log(`Total jobs: ${jobs.length}`);
jobs.forEach(job => {
  console.log(`Job ID: ${job._id}, Title: ${job.title}, Company: ${job.company?.name}, Created by: ${job.created_by?.fullname}`);
});

// Check total applications
const applications = await Application.find({});
console.log(`\nTotal applications: ${applications.length}`);
applications.forEach(app => {
  console.log(`Application ID: ${app._id}, Status: ${app.status}`);
});

// Check users
const users = await User.find({});
console.log(`\nTotal users: ${users.length}`);
users.forEach(user => {
  console.log(`User ID: ${user._id}, Name: ${user.fullname}, Email: ${user.email}, Role: ${user.role}`);
});

process.exit(0);
