const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Use /tmp for production (Railway, Vercel) because their FS is read-only
const UPLOAD_DIR =
  process.env.NODE_ENV === 'production'
    ? '/tmp/uploads'
    : path.join(__dirname, '../../public/uploads');

// Ensure the upload folder exists (locally and in /tmp)
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter (images only)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Export upload middleware
module.exports = {
  uploadImages: upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'galleryImages', maxCount: 10 },
  ]),
  upload,
};
