const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const adminSchema = new Schema({
    Username: {
        type: String,
        required: true,
      },
      Password: {
        type: String,
        required: true,
      },
      Email:{
        type:String,
        required:true
      }

}, { timestamps: true });
adminSchema.pre('save', function(next) {
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

const Admin = mongoose.model('admins', adminSchema);
module.exports = Admin;
