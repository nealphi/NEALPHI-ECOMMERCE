import multer from 'multer';
import path from 'path';

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
   cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const upload = multer({ storage: storage });
