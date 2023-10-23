const express = require('express');
let router = express.Router();
const {  userVerification } = require('../Middleware/AuthMiddleware');
const userModel = require("../Models/User");
const doctorModel = require("../Models/Doctor");
const packageModel = require("../Models/Packages");
const stripe = require('stripe')(process.env.SECRETKEY);
router.post("/pay",userVerification,async (req,res,next)=>{

    const doctorUsername=req.body.doctor; 
    //doctor's username
   // const appointmentID=req.body.app; //from doctor available array
    //calculate appointment price
    const doctor = await doctorModel.findOne({Username:doctorUsername});

    const package =await packageModel.findOne({Package_Name:req.user.healthPackage});
    var amount;
    
    if(!package){
      amount=doctor.HourlyRate * 1.1;
      console.log('error here1');

    }else{
        const discount=package.Session_Discount/100;
        amount= (doctor.HourlyRate * 1.1)*(1-discount);
    }
    amount=1000;

 console.log(amount);
    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    

   // const email=req.user.Email;
 
});

router.get("/config",(req,res)=>{
  res.send({
    publishableKey: process.env.PUBLISHABLE_KEY,
  });
})
module.exports = router;
