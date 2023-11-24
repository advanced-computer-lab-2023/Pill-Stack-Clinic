const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentIntentSchema = new Schema({
    intentId: {
        type: String,
    },
   
});

module.exports = PaymentIntent = mongoose.model('paymentIntent',PaymentIntentSchema);