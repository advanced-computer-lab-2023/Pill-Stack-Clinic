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

const http = require("http");
const cors = require('cors');
const{Server} = require("socket.io");
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

const server = http.createServer(app);

app.use(cors(corsOptions));

const io = new Server(server,{
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET","POST"],
  },
});
io.on("connection", (socket)=>{
  console.log(`user Connected: ${socket.id}`);

  socket.on("join_room",(data)=>{
    socket.join(data);
    console.log(`user with ID: ${socket.id} joined room: ${data}`)

  });

  socket.on("send_message",(data=>{
    socket.to(data.room).emit("receive_message",data);
  }));


  socket.on("disconnect",()=>{
    console.log("User disconnected", socket.id);
    });
});

const port = process.env.PORT || "8000";
const doctor = require("./Routers/doctorRoute");
const pharmacist = require("./Routers/pharmacistRoute");
const admin = require("./Routers/adminRoute");
const patient = require("./Routers/patientRoute");
const auth = require("./Routers/authRoute");
const stripeRoute = require("./Routers/stripeRoute");
const cart = require("./Routers/cartRoute");
const order = require("./Routers/orderRoute");

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
 server.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
  })
})
.catch(err => console.log(err));



// root route
app.use("/",auth );
// /doctor routes
app.use("/doctor", doctor);
//Admin routes
app.use("/admin",admin)
// patient routes
app.use("/patient", patient);
app.use("/stripe", stripeRoute);
app.use("/cart",cart);
app.use("/order",order)
app.use("/pharmacist",pharmacist)








 
 

  










/*
                                                    End of your code
*/

