import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import bcrypt from 'bcryptjs';
import { User } from './models/usermodel.js';

await connectDB();

try {
  // Delete existing user if exists
  await User.deleteOne({ email: 'priyabuagde143@gmail.com' });

  const hashedPassword = await bcrypt.hash('3010', 10);

  const newUser = new User({
    fullname: 'Priya Bugade',
    email: 'priyabuagde143@gmail.com',
    password: hashedPassword,
    role: 'Student',
    profile: {
      profilePhoto: '',
    },
  });

  await newUser.save();
  console.log('User created:', newUser.fullname);
  process.exit(0);
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}
