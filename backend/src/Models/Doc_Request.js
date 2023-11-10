const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const docReqSchema = new Schema({
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
    RegisterationStatus: {
      type: String,
      default: 'Pending',
    },
    PlatformStatus: {
      type: String,
      default: 'Pending',
    },
    Speciality: {
      type: String,
    },
    idDocument: {
      data: Buffer,
      contentType: String,
    },
    medicalLicenseDocument: {
      data: Buffer,
      contentType: String,
    },
    medicalDegreeDocument: {
      data: Buffer,
      contentType: String,
    }

}, { timestamps: true });
docReqSchema.pre('save', function(next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.Password, salt, null, (error, hash) => {
      if (error) {
        return next(error);
      }
      console.log('HASH: ', hash);
      user.password = hash;
      console.log('USER.PASSWORD: ', user.Password);
      next();
    });
  });
});


const doc_req = mongoose.model('Doc_Request', docReqSchema);
module.exports = doc_req;

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