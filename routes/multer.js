const multer = require('multer');
const {v4:uuidv4} = require('uuid');
const path = require('path');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: mycloud,
  api_key: 885751177364496,
  api_secret: LJgu8vYBG2bKKzMnpK4SieZsTZQ
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
