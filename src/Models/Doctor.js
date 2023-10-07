const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const doctorSchema = new Schema({
    // Username: req.body.username, 
    // Name: req.body.name, 
    // Email:req.body.email, 
    // Password:req.body.password,
    // DateOfBirth: req.body.dob,
    // HourlyRate: req.body.hourly_rate,
    // Affiliation: req.body.affiliation,
    // EducationalBackground: req.body.educational_background 
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
    HourlyRate: {
        type: Number,
        required: true,
    },
    Affiliation: {
        type: String,
        required: true,
    },
    EducationalBackground: {
        type: String,
        required: true,
    },
    Speciality:{
        type: String
    },

    Availability:{
        type:[],
    }

}, { timestamps: true });

const doctor = mongoose.model('Doctor', doctorSchema);
module.exports = doctor;

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