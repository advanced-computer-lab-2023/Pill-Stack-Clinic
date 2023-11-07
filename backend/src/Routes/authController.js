const userModel = require("../Models/User");
const doctorModel = require("../Models/Doctor");
const adminModel = require("../Models/Admin");
const docModel = require("../Models/Doc_Request");
const otpModel = require("../Models/Otp");

require("dotenv").config();
const jwt = require("jsonwebtoken");
const sendEmail = require("../Utilities/SendEmail");




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
//CREATED AS AN APPLICATION NOT AN ACCOUNT 
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
    console.log(req.body);
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
       Password:secPass,  Email:req.body.email});
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
          if(doctor.ContractStatus){
            role='doctorContractSigned'
          }else{
            role='doctorContractUnSigned'

          }
     
        }else{
          loggedIn=admin;
          console.log(loggedIn.Password);

          role='admin';
        }
      }
      console.log(role);
      const auth = await bcrypt.compare(password,loggedIn.Password)
      if (!auth) {
        return res.json({message:'Incorrect password or email' }) 
      }
      console.log(loggedIn);
       const token = createSecretToken(loggedIn._id,role);
       res.cookie("token", token, {
         withCredentials: true,
         httpOnly: false,
       });
       
       res.status(201).json({ message: "User logged in successfully", success: true,role: role  });
     //  next()
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
        var user;
        if(data.role==='patient'){
         user = await userModel.findById(data.id);
        }

        if(data.role==='doctorContractSigned' || data.role==='doctorContractUnSigned' ){
           user = await doctorModel.findById(data.id);
          }
          if(data.role==='admin'){
             user = await adminModel.findById(data.id);
            }
        

        if (user) {
          res.json({ status: true, user: user.Username })
      
      }

        else {

          
          return res.json({ status: false })}
      }
    })
  }
  module.exports.Logout = (req, res) => {
    const username = req.user.Username;
   console.log(username);
    // Clear the token cookie by setting it to an empty string and expiring it
    res.cookie('token', '', { expires: new Date(0), httpOnly: false });
console.log('logout is being called');
    // Optionally, you can also clear the user's session or perform other cleanup tasks here if needed.
console.log(username);
    res.status(200).json({ message: 'User logged out successfully', success: true });
};
 module.exports.ChangePassword= async(req,res)=>{
  const oldPassword=req.body.oldPassword;
  const newPassword=req.body.newPassword;
  const username=req.user.Username;
  const user = await userModel.findOne({ Username:username });
  const doctor= await doctorModel.findOne({ Username:username });
  const admin = await adminModel.findOne({ Username:username });
  var loggedIn=null;
  var role=null;
  if(user){
    loggedIn=user;
    role='patient';
  }else{
    if(doctor){
      loggedIn=doctor;
      if(doctor.ContractStatus){
        role='doctorContractSigned';
      }else{
        role='doctorContractUnSigned';
      }
    }else{
      loggedIn=admin;
      role='admin';
    }
  }
      const auth = await bcrypt.compare(oldPassword,loggedIn.Password)
      if (!auth) {
        return res.json({message:'Incorrect old password' }) 
      }
      if (!newPassword.match(/^(?=.*[A-Z])(?=.*[0-9]).{8,}$/)) {
        return res.status(400).json({ message: 'New password does not meet requirements' });
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(newPassword, salt) ;
    loggedIn.Password=secPass;
    loggedIn.save();
    console.log(loggedIn.Password);

    const token = createSecretToken(loggedIn._id,role);
       res.cookie("token", token, {
         withCredentials: true,
         httpOnly: false,
       });
       res.status(201).json({ message: "Password changed successfully", success: true });


 }
 module.exports.SendOTP= async(req,res)=>{
  
 
  const email=req.body.email;
  const user = await userModel.findOne({ Email:email });
  const doctor= await doctorModel.findOne({ Email:email });
  const admin = await adminModel.findOne({ Email:email });
  var loggedIn=null;
  if(user){
    loggedIn=user;
  }else{
    if(doctor){
      loggedIn=doctor;
    }else{
      loggedIn=admin;
    }
  }
  if(loggedIn===null){
    return res.send("No account linked to this email");
  }
  const OTP=Math.floor(100000 + Math.random() * 900000).toString();
  try{
    const status=await sendEmail(email, "Password reset", OTP);
    if(status){
      await otpModel.deleteOne({email:email});
      const otpObject=await otpModel.create({email:email,otp:OTP,createdAt:Date.now(),expiresAt:Date.now()+360000*+1});
     return  res.send("password reset otp sent to your email account");

    }


  }catch(error){
    console.log(error);
  }


 }
 module.exports.ResetPassword= async(req,res)=>{
  const OTP=req.body.otp;
  const email=req.body.email;
  const newPassword=req.body.newPassword;
  const matchedOTP=await otpModel.findOne({email:email});
  if(matchedOTP.expiresAt<Date.now()){
    return res.send("OTP has expired ");
  }
  if(matchedOTP.otp!==OTP){
    return res.send("OTP is wrong");

  }
  const user = await userModel.findOne({ Email:email});
  const doctor= await doctorModel.findOne({Email:email });
  const admin = await adminModel.findOne({ Email:email });
  var loggedIn=null;
  var role=null;
  if(user){
    loggedIn=user;
    role='patient';
  }else{
    if(doctor){
      loggedIn=doctor;
      if(doctor.ContractStatus){
        role='doctorContractSigned' 
      }else{
        role='doctorContractUnSigned' 
      }
    }else{
      loggedIn=admin;
      role='admin';
    }
  }
     
      if (!newPassword.match(/^(?=.*[A-Z])(?=.*[0-9]).{8,}$/)) {
        return res.status(400).json({message: 'New password does not meet requirements'});
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(newPassword, salt) ;
    loggedIn.Password=secPass;
    loggedIn.save();

    const token = createSecretToken(loggedIn._id,role);
       res.cookie("token", token, {
         withCredentials: true,
         httpOnly: false,
       });
      return res.status(201).json({ message: "Password changed successfully", success: true });


 }

  