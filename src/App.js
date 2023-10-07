// External variables
const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
require("dotenv").config();
const {patientRegister ,addFamilyMem,getUsers,searchDoctors, updateUser, deleteUser} = require("./Routes/userController");
const {createDocReq} = require("./Routes/doctorController");
const {addAdmin} = require("./Routes/adminController");

const MongoURI = process.env.MONGO_URI ;


//App variables
const app = express();

const path = require("path");

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static("src/view/"));
const port = process.env.PORT || "8000";
const user = require('./Models/User');
const doctor = require("./Routers/doctorRoute");
const admin = require("./Routers/adminRoute");
const patient = require("./Routers/patientRoute");

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
app.get("/", (req, res) => {
  res.status(200).render('home')
  });


// /doctor routes
app.use("/doctor", doctor);
//Admin routes
app.use("/admin",admin)
// patient routes
app.use("/patient", patient);

app.get("/admin_home", (req, res) => {
  res.render('admin_home')
  });



app.get("/register", (req, res) => {
  res.render('register')
  });



app.route('/doc_register')
  .get((req, res) => { res.render('doc_register')})
  .post(createDocReq);


// #Routing to userController here
console.log("hello world");
app.use(express.json())
app.post("/addUser",patientRegister);
app.post("/addFamMem/:registeredUsername",addFamilyMem);
app.post("/searchDoctors",searchDoctors)

app.get("/users", getUsers);
app.put("/updateUser", updateUser);
app.delete("/deleteUser", deleteUser);


/*
                                                    End of your code
*/

