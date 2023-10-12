const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const adminSchema = new Schema({
    Username: {
        type: String,
        required: true,
      },
      Password: {
        type: String,
        required: true,
      }
}, { timestamps: true });
const Admin = mongoose.model('admins', adminSchema);
module.exports = Admin;
