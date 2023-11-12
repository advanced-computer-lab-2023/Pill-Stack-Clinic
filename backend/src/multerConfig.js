const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const username = req.user.Username; // 
    const dest = `Uploads/medical-history/${username}`;

    // Check if the folder exists, create it if not
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    cb(null, dest);
  },
  filename: function (req, file, cb) {
    // Set the filename to be unique or as needed
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|pdf/; // Add or modify file types as needed
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Invalid file type');
  }
}

// Set up Multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Set a file size limit if needed
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

module.exports = upload;
