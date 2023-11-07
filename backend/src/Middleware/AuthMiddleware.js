const userModel = require("../Models/User");
const doctorModel = require('../Models/Doctor.js');
const adminModel = require('../Models/Admin.js');


require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.userVerification = (req, res,next) => {
  const token = req.cookies.token
  if (!token) {

    return res.json({ status: false })
  }
  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
     return res.json({ status: false })
    } else {
      var user;
        if(data.role==='patient'){
         user = await userModel.findById(data.id);
        }
        if(data.role==='doctorContractSigned' || data.role==='doctorContractUnSigned' ){
           user = await doctorModel.findById(data.id);
          }
          if(data.role==='admin'){
             user = await adminModel.findById(data.id);
            }
        

      if (user) {
      req.user = user;
      next(); 
    }
      else return res.json({ status: false })
    }
  })
}
