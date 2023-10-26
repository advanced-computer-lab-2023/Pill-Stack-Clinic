const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contractSchema = new Schema({
  DoctorId: {
    type: Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  Markup: {
    type: Number,
    required: true
  }
}, { timestamps: true });

const Contract = mongoose.model('Contract', contractSchema);
module.exports = Contract;