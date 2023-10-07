const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
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
  },
  familyMembers: [
    new Schema({
      MemberName: {
        type: String,
        required: true,
        default: 'null' // You can set a default value here
      },
      NationalID: {
        type: Number,
        required: true,
        default: 0 // Default value for NationalID
      },
      Age: {
        type: Number,
        required: true,
        default: 0 // Default value for Age
      },
      Gender: {
        type: String,
        required: true,
        default: 'Unknown' // Default value for Gender
      },
      Relation: {
        type: String,
        required: true,
        default: 'Unknown' // Default value for Relation
      },
    })
  ], BookedAppointments: [
    new Schema({
      DoctorUsername: String,
      DoctorName:String,
      Date:Date,
      Status: {
        type: String,
        enum: ['upcoming', 'completed', 'cancelled', 'rescheduled'],
      }    })
  ]
}, { timestamps: true });

const User = mongoose.model('Users', userSchema);
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