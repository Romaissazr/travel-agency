const path = require('path');
const multer = require('multer');
const fs = require('fs');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
   
    const uploadPath = path.join(__dirname, '../uploads');

  
    if (!fs.existsSync(uploadPath)) {
     
      fs.mkdirSync(uploadPath, { recursive: true }); 
      console.log('Uploads directory created');
    }

    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {

    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

// Initialize multer with storage and file filter
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      return cb(new Error('Only image files are allowed!'), false);
    }
  }
});

module.exports = upload;
