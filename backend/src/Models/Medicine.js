const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const medicineSchema = new Schema({

      Name: {
        type: String,
        required: true,
      },
      Details: {
        type: String,
        required: true,
      },
      Price: {
        type: Number,
        required: true,
      },
      Quantity: {
        type: Number,
        required: true,
      },
      Sales: {
        type: Number,
      },
      Image: {
        data: Buffer, // Store the filename as a string
        contentType: String,
      },
      MedicinalUse: [{
        type: String,
      }],
    }, { timestamps: true });

const Medicines = mongoose.model('Medicines', medicineSchema);
module.exports = Medicines;