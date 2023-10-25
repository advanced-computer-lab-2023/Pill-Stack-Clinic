const express = require('express');
let router = express.Router();
const {  userVerification } = require('../Middleware/AuthMiddleware');
const userModel = require("../Models/User");
const doctorModel = require("../Models/Doctor");
const packageModel = require("../Models/Packages");
const stripe = require('stripe')(process.env.SECRETKEY);
router.post("/pay",userVerification,async (req,res,next)=>{
    const appointmentId=req.body.appid; //from doctor's available appointment;
    const username=req.user.Username;
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
    amount=Math.ceil(amount);

 console.log(amount);
    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount*100,
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
router.post('/pay/confirm',userVerification, async (req, res) => {
  console.log('starting here');

    const appointmentId='6538d28c5c0f1469e7b108d9'//req.body.appid; //from doctor's available appointment;
    const doctorUserName='doctorTesting'//req.body.doctorUsername;
    const username=req.user.Username;
   const user=await userModel.findOne({Username:username});
   const doctor=await doctorModel.findOne({Username:doctorUserName});
   const Appointment = doctor.Availability.find(
   (av) => {

      return ((av._id).toString()=== appointmentId)}
 );
 console.log(Appointment)
 if(Appointment){
const docApp=({
   _id:Appointment._id,
   PatientUsername:username,
   PatientName:req.user.Name,
   StartDate:Appointment.StartDate,
   EndDate:Appointment.EndDate,
   Status:'upcoming',
});
doctor.BookedAppointments.push(docApp);
const userApp=({
   _id:Appointment._id,
   DoctorUsername:doctorUserName,
   DoctorName:doctor.Name,
   StartDate:Appointment.StartDate,
   EndDate:Appointment.EndDate,
   Status:'upcoming',
});
user.BookedAppointments.push(userApp);
doctor.Availability.remove({_id:appointmentId});
doctor.save();
user.save();
 }
res.json({ success: true });





  



});
module.exports = router;
