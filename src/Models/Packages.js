const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PackageSchema = new Schema({
    Package_Name :{
        type:   String,
        required: true
},
    Price :{
        type: Number,
        required: true
    },
    Session_Discount :{
        type: Number,
        required: true
    },
    Pharmacy_Discount :{
        type: Number,
        required: true
    },
    Family_Discount :{
        type: Number,
        required: true
    }
},

    { timestamps: true });
    
const package = mongoose.model('Package', PackageSchema);
module.exports = package;