const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");


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
    WalletBalance:{
      type: Number,
      default: 0,
    },
    ContractStatus: {
      type: Boolean,
      default: false
    },
    Availability:
      [ new Schema({
          _id: mongoose.Schema.Types.ObjectId,
          StartDate: Date,
          EndDate:Date,
        })
      ]
    ,
    BookedAppointments: [
      new Schema({
        _id: mongoose.Schema.Types.ObjectId,

        PatientUsername: String,
        PatientName:String,
        StartDate:Date,
        EndDate:Date,
        Price:Number,
        Status: {
          type: String,
          enum: ['upcoming', 'completed', 'cancelled', 'rescheduled'],
        }
              })
    ],
    followup: [
      new Schema({
        _id: mongoose.Schema.Types.ObjectId,

        PatientUsername: String,
        PatientName:String,
        StartDate:Date,
        EndDate:Date,
        Price:Number,
        Status: {
          type: String,
          enum: ['upcoming', 'completed', 'cancelled', 'rescheduled'],
        }
              })
    ],
    HealthRecords:[
      {
        PatientUsername: { type: String, required: true },
        RecordDetails: { type: String, required: true },
        RecordDate: { type: Date, required: true },
      },
    ],
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
    },
    Notifications:[{
      type:String
    }]

}, { timestamps: true });
doctorSchema.pre('save', function(next) {
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
      user.Password = hash;
      console.log('USER.PASSWORD: ', user.Password);
      next();
    });
  });
});


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