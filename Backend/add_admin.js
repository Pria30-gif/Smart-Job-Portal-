import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import bcrypt from 'bcryptjs';
import { User } from './models/usermodel.js';

await connectDB();

try {
  // Delete existing admin if exists
  await User.deleteOne({ email: 'admin@example.com' });

  const hashedPassword = await bcrypt.hash('admin123', 10);

  const newAdmin = new User({
    fullname: 'Admin User',
    email: 'admin@example.com',
    password: hashedPassword,
    role: 'Admin',
    profile: {
      profilePhoto: '',
    },
  });

  await newAdmin.save();
  console.log('Admin user created:', newAdmin.fullname);
  process.exit(0);
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}
