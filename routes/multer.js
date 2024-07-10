const multer = require('multer');
const {v4:uuidv4} = require('uuid');
const path = require('path');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
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


// const storage = multer.diskStorage({
//   destination: function(req,file,cb){
//     cb(null,path.join(__dirname, '../public/images/uploads'))
//   },
//   filename : function(req,file,cb)
//   {
//      const uniquename = uuidv4();
//      cb(null,uniquename + path.extname(file.originalname)); 
//   }
// })

const upload = multer({storage:storage});

module.exports = upload;
