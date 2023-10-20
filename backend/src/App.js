 // External variables
const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
mongoose.set('strictQuery', false);
require("dotenv").config();
const {patientRegister ,addFamilyMem,getUsers,searchDoctors,selectedDoctorDetails, updateUser, deleteUser,searchAppointments, viewALLAppointments,viewDoctors,viewPrescriptions,filterPrescriptions,viewPrescribtion} = require("./Routes/userController");
const {createDocReq} = require("./Routes/doctorController");
const {addAdmin,removeUser} = require("./Routes/adminController");
const cors = require('cors');
var cookies = require("cookie-parser");



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



/////////////////////////////////////

// root route
app.use("/",auth );
// /doctor routes
app.use("/doctor", doctor);
//Admin routes
app.use("/admin",admin)
// patient routes
app.use("/patient", patient);







 
 

  










/*
                                                    End of your code
*/

