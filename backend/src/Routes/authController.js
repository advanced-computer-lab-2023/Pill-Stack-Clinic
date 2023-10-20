const userModel = require("../Models/User");
const doctorModel = require("../Models/Doctor");
const adminModel = require("../Models/Admin");
const docModel = require("../Models/Doc_Request");
require("dotenv").config();
const jwt = require("jsonwebtoken");



const { createSecretToken } = require("../Utilities/SecretToken");
const bcrypt = require("bcryptjs");
module.exports.PatientRegister = async (req, res, next) => {
  try {
    const existingUserinPatient = await userModel.findOne({ Username:req.body.username });
    const existingUserinDoctor = await doctorModel.findOne({ Username:req.body.username });
    const existingUserinAdmin = await adminModel.findOne({ Username:req.body.username });


    if (existingUserinPatient || existingUserinDoctor || existingUserinAdmin) {
      return res.json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
const secPass = await bcrypt.hash(req.body.password, salt) 
    const user = await userModel.create({    
      Username: req.body.username, 
      Name: req.body.name, 
      Email: req.body.email, 
      Password: secPass,
      DateOfBirth: req.body.dob,
      Gender: req.body.gender,
      MobileNumber: req.body.mobile,
      EmergencyContact_Name: req.body.EmergencyContact_name,
      EmergencyContact_MobileNumber: req.body.EmergencyContact_mobileNumber});
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res
      .status(201)
      .json({ message: "User signed in successfully", success: true, user });
    next();
  } catch (error) {
    console.error(error);
  }
};
module.exports.DoctorRegister = async (req, res, next) => {
  try {
    const existingUserinPatient = await userModel.findOne({ Username:req.body.username });
    const existingUserinDoctor = await doctorModel.findOne({ Username:req.body.username });
    const existingUserinAdmin = await adminModel.findOne({ Username:req.body.username });


    if (existingUserinPatient || existingUserinDoctor || existingUserinAdmin) {
      return res.json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
const secPass = await bcrypt.hash(req.body.password, salt) 
    const user = await docModel.create({    
      Username: req.body.username, 
       Name: req.body.name, 
       Email:req.body.email, 
       Password:secPass,
       DateOfBirth: req.body.dob,
       HourlyRate: req.body.hourly_rate,
       Affiliation: req.body.affiliation,
       EducationalBackground: req.body.educational_background   });
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res
      .status(201)
      .json({ message: "Doctor registered successfully", success: true, user });
    next();
  } catch (error) {
    console.error(error);
  }
};
module.exports.addAdmin = async (req, res, next) => {
  try {
    const existingUserinPatient = await userModel.findOne({ Username:req.body.username });
    const existingUserinDoctor = await doctorModel.findOne({ Username:req.body.username });
    const existingUserinAdmin = await adminModel.findOne({ Username:req.body.username });


    if (existingUserinPatient || existingUserinDoctor || existingUserinAdmin) {
      return res.json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
const secPass = await bcrypt.hash(req.body.password, salt) 
    const user = await adminModel.create({    
      Username: req.body.username, 
       Password:secPass,  });
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res
      .status(201)
      .json({ message: "Admin created successfully", success: true, user });
    next();
  } catch (error) {
    console.error(error);
  }
};
module.exports.Login = async (req, res, next) => {
    try {
      const { username, password } = req.body;
      if(!username || !password ){
        return res.json({message:'All fields are required'})
      }
      const user = await userModel.findOne({ Username:username });
      const doctor= await doctorModel.findOne({ Username:username });
      const admin = await adminModel.findOne({ Username:username });

      if(!user && !doctor && !admin){

        return res.json({message:'Incorrect password or email' }) 
      }
      var loggedIn=null;
      var role=null;
      if(user){
        loggedIn=user;
        role='patient';
      }else{
        if(doctor){
          loggedIn=doctor;
          role='doctor';
        }else{
          loggedIn=admin;
          console.log(loggedIn.Password);

          role='admin';
        }
      }
      console.log(password);
      const auth = await bcrypt.compare(password,loggedIn.Password)
      if (!auth) {
        return res.json({message:'Incorrect password or email' }) 
      }
       const token = createSecretToken(loggedIn._id,role);
       res.cookie("token", token, {
         withCredentials: true,
         httpOnly: false,
       });
       res.status(201).json({ message: "User logged in successfully", success: true });
       next()
    } catch (error) {
      console.error(error);
    }
  }
  module.exports.currentUser=(req, res,next) => {

    const token = req.cookies.token
    if (!token) {
      return res.json({ status: false })
    }
    jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
      if (err) {
       return res.json({ status: false })
      } else {
        const user = await userModel.findById(data.id);
        if (user) {
          res.json({ status: true, user: user.Username })
       // req.user = user;
       // next(); 
      }
        else return res.json({ status: false })
      }
    })
  }
  