import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import { User } from './models/usermodel.js';

await connectDB();

try {
  const result = await User.deleteOne({ email: 'priyabuagde143@gmail.com' });
  if (result.deletedCount > 0) {
    console.log('User deleted successfully');
  } else {
    console.log('User not found');
  }
  process.exit(0);
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}
