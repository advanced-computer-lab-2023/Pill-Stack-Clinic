const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const pharmaReqSchema = new Schema({
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
    IDDocument: {
      data: Buffer, 
      contentType: String, // content type ( application/pdf)
      
    },
    pharmacyDegreeDocument: {
      data: Buffer,
      contentType: String,
      
    },
    workingLicenseDocument: {
      data: Buffer,
      contentType: String,
    
    }

}, { timestamps: true });
pharmaReqSchema.pre('save', function(next) {
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

const pharma_req = mongoose.model('Pharmacist_Request', pharmaReqSchema);
module.exports = pharma_req;
