const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const cloudinary = require('cloudinary').v2; // Add this line to import Cloudinary
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Make sure to set these environment variables in your hosting environment
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', // Folder name in Cloudinary
    format: async (req, file) => path.extname(file.originalname).slice(1), // Use original file extension
    public_id: (req, file) => uuidv4() // Use a unique ID for the file name
  }
});

const upload = multer({ storage: storage });

module.exports = upload;
