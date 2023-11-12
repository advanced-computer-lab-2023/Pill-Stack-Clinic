 // External variables
const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
var bcrypt = require('bcryptjs');
mongoose.set('strictQuery', false);
require("dotenv").config();
const {patientRegister ,addFamilyMem,getUsers,searchDoctors,selectedDoctorDetails, updateUser, deleteUser,searchAppointments, viewALLAppointments,viewDoctors,viewPrescriptions,viewDoctorAppointments,filterPrescriptions,viewPrescribtion} = require("./Routes/userController");
const {createDocReq} = require("./Routes/doctorController");
const {addAdmin,removeUser} = require("./Routes/adminController");
const cors = require('cors');
var cookies = require("cookie-parser");
const fs = require('fs');



const MongoURI = process.env.MONGO_URI ;


//App variables
const app = express();

const path = require("path");

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static("src/view/"));
app.use(express.json())
app.use(cookies());


const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));
const port = process.env.PORT || "8000";
const user = require('./Models/User');
const doctor = require("./Routers/doctorRoute");
const admin = require("./Routers/adminRoute");
const patient = require("./Routers/patientRoute");
const auth = require("./Routers/authRoute");
const stripeRoute = require("./Routers/stripeRoute");

app.get('/serve-file', (req, res) => {
  const filePath = req.query.filePath;

  if (!filePath) {
    res.status(400).send('File path is missing.');
    return;
  }

  // Read the file and send it as the response
  const fileStream = fs.createReadStream(filePath);

  // Set the appropriate headers for inline display
  res.setHeader('Content-disposition', 'inline; filename=' + path.basename(filePath));
  res.setHeader('Content-type', 'application/pdf'); // Adjust the content type based on the file type

  // Pipe the file stream to the response
  fileStream.pipe(res);
});

// #Importing the userController
// configurations
// Mongo DB
mongoose.connect(MongoURI)
.then(()=>{
  console.log("MongoDB is now connected!")
// Starting server
 app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
  })
})
.catch(err => console.log(err));




//e



// // Create separate upload middleware for different types of files
// const uploadGeneralFiles = multer({ storage: storageForGeneralFiles }).fields([
//   { name: 'idDocument', maxCount: 1 },
//   { name: 'medicalLicenseDocument', maxCount: 1 },
//   { name: 'medicalDegreeDocument', maxCount: 1 },
// ]);


// // Use the appropriate middleware for the route where you want to handle file uploads
// app.post('/uploadGeneralFiles', uploadGeneralFiles, (req, res) => {
//  // iterate through the uploaded files and perform actions like saving them to a database
//   for (const fileField in req.files) {
//     if (req.files.hasOwnProperty(fileField)) {
//       const file = req.files[fileField][0];
//     }
//   }
// });



// // Define storage for a single file
// const storageForSingleFile = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'Uploads/single-files/');
//   },
//   filename: function (req, file, cb) {
//     const fileExtension = path.extname(file.originalname);
//     const uniqueFilename = Date.now() + fileExtension;
//     cb(null, uniqueFilename);
//   },
// });

// Create upload middleware for a single file
// const uploadSingleFile = multer({ storage: storageForSingleFile }).single('document');

// // Handle the single file upload
// app.post('/uploadSingleFile', uploadSingleFile, (req, res) => {
//   if (!req.file) {
//     // If no file is uploaded, respond with an error
//     return res.status(400).json({ error: 'No file uploaded' });
//   }

//   // The uploaded file is available as req.file
//   const uploadedFile = req.file;

//   // Respond with a success message and the file details
//   res.status(200).json({
//     message: 'File uploaded successfully',
//     file: {
//       originalname: uploadedFile.originalname,
//       filename: uploadedFile.filename,
//       destination: uploadedFile.destination,
//     },
//   });
// });



// // Include the doctorRoute
// app.use('/doctor', doctorRoute);

//e


/////////////////////////////////////

// root route
app.use("/",auth );
// /doctor routes
app.use("/doctor", doctor);
//Admin routes
app.use("/admin",admin)
// patient routes
app.use("/patient", patient);
app.use("/stripe", stripeRoute);








 
 

  










/*
                                                    End of your code
*/

