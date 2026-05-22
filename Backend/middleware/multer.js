<<<<<<< HEAD
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

export const singleUpload = multer({ storage }).single("file");
=======
// Backend/middleware/multer.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = path.join(process.cwd(), 'mockInterviewUploads');

// Ensure directory exists
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Define storage configuration
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    // Keep original file extension
    cb(null, `${unique}-${file.originalname}`);
  }
});

// Main upload middleware instance (default export)
const upload = multer({ 
    storage, 
    // Set a file size limit (e.g., 200MB) to prevent abuse
    limits: { fileSize: 200 * 1024 * 1024 } 
});

export default upload;

// For compatibility with older code that expected named export:
export const singleUpload = upload.single('file');
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
