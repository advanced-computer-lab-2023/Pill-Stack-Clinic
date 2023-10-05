const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  // Username: req.body.username, 
  // Name: req.body.name, 
  // Email:req.body.email, 
  // Password:req.body.password,
  // DateOfBirth: req.body.dob,
  // Gender: req.body.gender,
  // MobileNumber: req.body.mobile,
  // EmergencyContact_Name: req.body.EmergencyContact_name,
  // EmergencyContact_MobileNumber: req.body.EmergencyContact_mobileNumber
  Username: {
    type: String,
    required: true,
  },
  Name: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true
  },
  Password: {
    type: String,
    required: true,
  },
  DateOfBirth:{
    type: Date,
    required: true,
  },
  Gender: {
    type: String,
    required: true,
  },
  MobileNumber: {
    type: Number,
    required: true,
  },
  EmergencyContact_Name: {
    type: String,
    required: true,
  },
  EmergencyContact_MobileNumber: {
    type: Number,
    required: true,
  }

}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;

// json object
// {
// "username" : "dav",
// "name": "davisd",
// "email": "dav@gmail.com",
// "password": "davisd",
// "dob": "1999-12-12",
// "gender" : "male",
// "mobile" : "1234567890",
// "EmergencyContact_name" : "davisd",
// "EmergencyContact_mobileNumber" : "1234567890"

// }