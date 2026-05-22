import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import bcrypt from 'bcryptjs';
import { User } from './models/usermodel.js';

await connectDB();

try {
  // Delete existing recruiter if exists
  await User.deleteOne({ email: 'recruiter@test.com' });

  const hashedPassword = await bcrypt.hash('password123', 10);

  const newUser = new User({
    fullname: 'Test Recruiter',
    email: 'recruiter@test.com',
    password: hashedPassword,
    role: 'Recruiter',
    profile: {
      profilePhoto: '',
    },
  });

  await newUser.save();
  console.log('Recruiter user created:', newUser.fullname);
  console.log('Email: recruiter@test.com');
  console.log('Password: password123');
  process.exit(0);
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}