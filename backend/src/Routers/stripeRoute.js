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

    const package =await packageModel.findOne({Package_Name: user.healthPackage.Package_Name});
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




router.post("/payPack",userVerification,async (req,res,next)=>{
  const username=req.body.Username;
  const packid=req.body.packID;
  const package =await packageModel.findById(packid);
  var amount;
  amount=package.Price;
  console.log(amount);
  const paymentIntent = await stripe.paymentIntents.create({
      amount: amount*100,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  

});


router.post('/payPack/confirm',userVerification, async (req, res) => {
  const packageID=req.body.packageID;
   const pack= await packageModel.findById(packageID);
   if(!pack){
      res.status(404).send("Package Not Found");
   }
   const userID=req.body.userId;
   const user=await userModel.findById(userID);
   if(!user){
      res.status(404).send("User Not Found");
   }
   if(user.healthPackage.length!=0){
      res.send("User Already Subscribed to a Package");
   }
   if(user.WalletBalance<pack.Price){
      res.send("No Enough Balance");
   }
   else{
   const userPack=({
      _id:packageID,
      Package_Name:pack.Package_Name,
      Price:pack.Price,
      Session_Discount:pack.Session_Discount,
      Family_Discount:pack.Family_Discount,
      Pharmacy_Discount:pack.Pharmacy_Discount,
      Status:'Subscribed',
      Date:  new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
   });
   user.healthPackage.push(userPack);
    user.WalletBalance=user.WalletBalance-pack.Price;
   if(user.familyMembers.length==0){
      console.log("No family members");
   }
   else{
   for(let i=0;i<user.familyMembers.length;i++){
      user.familyMembers[i].Family_Discount=pack.Family_Discount;
   }
   }
   res.send("Subscribed succsefully");
   await user.save();
 }
res.json({ success: true });


});




module.exports = router;
