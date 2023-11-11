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
    var amount=req.body.amount;
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
  console.log('starting here Confirm');
    const amount=req.body.amount;
    console.log(amount);
    const linkedFamMember=req.body.member; //let it be ID
    console.log(linkedFamMember);
    const manualFamMember=req.body.manualMem;
    console.log(manualFamMember);
    const appointmentId=req.body.appid; //from doctor's available appointment;
    console.log(appointmentId);

    const doctorUserName=req.body.doctorUsername;
    console.log(doctorUserName);

    const username=req.user.Username;
   const user=await userModel.findOne({Username:username});
   const doctor=await doctorModel.findOne({Username:doctorUserName});
   const Appointment = doctor.Availability.find(
   (av) => {

      return ((av._id).toString()=== appointmentId)}
 );
 console.log(Appointment)
 if(Appointment){
   if(linkedFamMember==='undefined'){
      if(manualFamMember==='undefined'){
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
      }else{
         const docApp=({
            _id:Appointment._id,
            PatientUsername:username,
            PatientName:manualFamMember,
            StartDate:Appointment.StartDate,
            EndDate:Appointment.EndDate,
            Status:'upcoming',
         });
         doctor.BookedAppointments.push(docApp);
         const userApp=({
            _id:Appointment._id,
            PatientName:manualFamMember,
            DoctorUsername:doctorUserName,
            DoctorName:doctor.Name,
            StartDate:Appointment.StartDate,
            EndDate:Appointment.EndDate,
            Status:'upcoming',
         });
         user.FamilyBookedAppointments.push(userApp);
      }
      
       }else{
         const familyMember=await userModel.findById(linkedFamMember);
   
         const docApp=({
            _id:Appointment._id,
            PatientUsername:familyMember.Username,
            PatientName:familyMember.Name,
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
         familyMember.BookedAppointments.push(userApp);
         familyMember.save();
      
       }

doctor.Availability.remove({_id:appointmentId});
const docBalance=doctor.WalletBalance+(0.9*amount);
doctor.WalletBalance=docBalance;
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
   console.log("DAREEENNNN",packageID);
   
   const pack= await packageModel.findById(packageID);
   if(!pack){
      res.status(404).send("Package Not Found");
   }
   const username=req.body.username;
   const user=await userModel.findOne({Username:username});
   console.log(user);
   if(!user){
      res.status(404).send("User Not Found");
   }
   for(let i=0;i<user.healthPackage.length;i++){
      if(user.healthPackage[i].Status=="Subscribed" && user.healthPackage[i].Owner==true){
         res.send("User Already Subscribed to Package: "+ user.healthPackage[i].Package_Name);
         return;
      }
   }
   // if(user.healthPackage.length!=0){
   //    res.send("User Already Subscribed to a Package");
   // }
   // if(user.WalletBalance<pack.Price){
   //    res.send("No Enough Balance");
   // }
   //else{
      for(let i=0;i<user.healthPackage.length;i++){
         if(user.healthPackage[i].Owner==true){
         user.healthPackage[i].remove();}
      }
   const userPack=({
      _id:packageID,
      Package_Name:pack.Package_Name,
      Price:pack.Price,
      Session_Discount:pack.Session_Discount,
      Family_Discount:pack.Family_Discount,
      Pharmacy_Discount:pack.Pharmacy_Discount,
      Status:'Subscribed',
      Renewl_Date:  new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      Owner:true,
   });
   user.healthPackage.push(userPack);
   await user.save();
   // user.WalletBalance=user.WalletBalance-pack.Price;
   if(user.familyMembers.length==0){
      console.log("No family members");
   }
   if(user.LinkedPatientFam.length==0){
      console.log("No Linked family members");
   }
   else{
      for(let i=0;i<user.LinkedPatientFam.length;i++){
         const linkedFam = await userModel.findById(user.LinkedPatientFam[i].memberID);
         for(let j=0;j<linkedFam.healthPackage.length;j++){
            console.log(!linkedFam.healthPackage[j].Status==='Subscribed');
            const bool=!linkedFam.healthPackage[j].Status==='Subscribed';
            if(bool && linkedFam.healthPackage[j].Owner==false ){
               console.log("in1");
               linkedFam.healthPackage[j].remove();
               await linkedFam.save();
            }
         }
         const userPack=({
            _id:packageID,
            Package_Name:pack.Package_Name,
            Price:pack.Price,
            Session_Discount:pack.Session_Discount,
            Family_Discount:pack.Family_Discount,
            Pharmacy_Discount:pack.Pharmacy_Discount,
            Status:'Subscribed',
            Renewl_Date:  new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            Owner:false,
         });
         linkedFam.healthPackage.push(userPack);
         await linkedFam.save();
   }
   }
   res.send("Subscribed succsefully");
   await user.save();
});




module.exports = router;
