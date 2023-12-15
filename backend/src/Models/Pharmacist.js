const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const chatSchema = new mongoose.Schema({
  room: {
    type: String,
    unique: true,
  },
  doctorUsername: String,
  pharmacistUsername:String,
  messages: [
    {
      sender: String,
      recipient: String,
      message: String,
      timestamp: { type: String,
        default: `${new Date(Date.now()).getHours()}:${new Date(Date.now()).getMinutes()}`, },
    },
  ],
});
const pharmacistSchema = new Schema({

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
      hourly_rate:{
      type : Number,
      required:true,
      },
      affiliation:{
      type:String,
      required:true,
    },
    chatRooms: [chatSchema],
    education_background:{
        type:String,
        required:true,
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
    
    }, WalletBalance:{
      type: Number,
      default: 0,
    },  Notifications:[{
      type:String
    }]
    
    
    }, { timestamps: true});
    pharmacistSchema.pre('save', function(next) {
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

const Pharmacist = mongoose.model('Pharmacist', pharmacistSchema);
module.exports = Pharmacist;