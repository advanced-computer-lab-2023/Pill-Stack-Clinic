// #Task route solution
const userModel = require('../Models/User.js');
const { default: mongoose } = require('mongoose');
const doctorModel = require('../Models/Doctor.js');// Database of doctors on the platform:accepted by admin 
const packageModel=require('../Models/Packages.js');




const addFamilyMem = async (req, res) => {
   try {
      const username = req.user.Username;

      const user = await userModel.findOne({ Username: username });

      if (!user) {
         return res.status(404).json({ message: 'User not found' });
      }

      console.log(req.body.username)
      const member = ({
         MemberName: req.body.username,
         NationalID: req.body.nationalID,
         Age: req.body.age,
         Gender: req.body.gender,
         Relation: req.body.relation
      });
      
      if (!user.familyMembers) {
         user.familyMembers = [];
      }

      user.familyMembers.push(member);
      
      await user.save();
      res.status(200).send("Family Member added successfully")


   } catch (error) {
      console.error('Error adding family member:', error);
      res.status(500).json({ message: 'Internal server error' });
   }
}
const searchDoctors = async (req, res) => {
   try {
       const { name, speciality, date, time  } = req.body;
       let query = {};


       if (name) {
           query["Name"] = { $regex: new RegExp(name, 'i') };
       }

       if (speciality) {
           query["Speciality"] = { $regex: new RegExp(speciality, 'i') };
       }

      if (date) {
         const dateFormatted = new Date(`${date}T${time}:00.000Z`);
         query["Availability.StartDate"] =  dateFormatted ;
      }
       const doctors = await doctorModel.find(query);
       res.status(200).json(doctors);
   } catch (error) {
       console.error('Error searching doctors:', error);
       res.status(500).json({ message: 'Internal server error' });
   }
};




const getUsers = async (req, res) => {
   const users = await userModel.find({});
   res.send(users);  
}


  const viewALLAppointments =async(req,res)=>{
   const username = req.user.Username;

   const profile = await userModel.findOne({ Username: username });
   const BookedAppointments = profile.BookedAppointments;
   res.status(200).json(BookedAppointments);
 
 
  }
  const searchAppointments =async(req,res)=>{
   const username = req.user.Username;
   const appStatus=req.body.status;
   let BookedAppointments;
  const user = await userModel.findOne({ Username: username });
  if(appStatus==='null' && req.body.sDate!=='' ){
   const appDate=new Date(req.body.sDate);
   const appEDate=new Date(req.body.eDate);
    BookedAppointments =  user.BookedAppointments.filter((appointment) =>{
     const appointmentStartDate = new Date(appointment.StartDate);
    return (
     appointmentStartDate>=appDate && appointmentStartDate<=appEDate
    );
}
 );     
}

   if(req.body.sDate==='' && appStatus!=='null'){
   
    BookedAppointments =  user.BookedAppointments.filter((appointment) =>{
    
      return (
        appointment.Status===appStatus
      );
}
   );

}
   if(req.body.sDate!=='' && appStatus!=='null')
   {
    BookedAppointments =  user.BookedAppointments.filter((appointment) =>{
      const appDate=new Date(req.body.sDate);
     const appEDate=new Date(req.body.eDate);
     const appointmentStartDate = new Date(appointment.StartDate);
     return (
      appointmentStartDate>=appDate && appointmentStartDate<=appEDate &&

       appointment.Status===appStatus

     );
  }
  );
}







res.status(200).json(BookedAppointments);

}

const selectedDoctorDetails = async (req, res) => {
   try {
    
      const username = req.params.username; 
      console.log(username);
    //  const username = "Nada"

      const doctor = await doctorModel.findOne({ Username: username });

      if (!doctor) {
         return res.status(404).json({ message: 'Doctor not found' });
      }

      res.send(doctor);

   } catch (error) {
      console.error('Error retrieving selected doctor:', error);
      res.status(500).json({ message: 'Internal server error' });
   }
};

const viewPatientWallet = async (req, res) => {
   try {
     const userId = req.user.id; // Assuming you have user ID available in req.user
 
     const user = await userModel.findById(userId);
 
     if (!user) {
       return res.status(404).json({ error: 'User not found' });
     }
 
     res.json({ WalletBalance: user.WalletBalance });
   } catch (error) {
     res.status(500).json({ error: 'Internal server error' });
   }
 };
// const viewDoctors = async (req, res) => {
//    try {
//       const doctors = await doctorModel.find();
//       const user = await userModel.findOne({Username: "omarr" });
//       const package =await packageModel.findOne({Package_Name:user.healthPackage});
//       const discount=package.Session_Discount/100;
//       console.log(discount);
//       const updatedDoctors = doctors.map((doctor) => {
         
//          if (user.healthPackage) {
//             return {
//                name: doctor.Username,
//                price: (doctor.HourlyRate * 1.1)*(1-discount),
//                Speciality: doctor.Speciality
//             };
//          } else {
//             return {
//                name: doctor.Username,
//                price: doctor.HourlyRate * 1.1,
//                Speciality:doctor.Speciality
//             };
//          }
//       });
//       // Render the EJS template with the JSON data
//       res.send({doctors: updatedDoctors });
//    } catch (error) {
//       console.error(error);
//       res.status(500).send('Error fetching doctors');
//    }
// };



const viewDoctors = async (req, res) => {
   try {
      const doctors = await doctorModel.find();
     //const user = await userModel.findOne({ Username: "omarr" });
     const username = req.user.Username;
     const user = await userModel.findOne({Username:username});
      if (user) {
         const package = await packageModel.findOne({ Package_Name: user.healthPackage });
         const discount = package ? package.Session_Discount / 100 : 0;

         const updatedDoctors = doctors.map((doctor) => {
            return {
               name: doctor.Username,
               price: (doctor.HourlyRate * 1.1) * (1 - discount),
               speciality: doctor.Speciality,
            };
         });
         // Render the EJS template with the JSON data
         res.send(updatedDoctors);
      } else {
         // Handle the case when the user is not found
         res.status(404).send('User not found');
      }
   } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching doctors');
   }
};
const viewFamilyMembers = async (req, res) => {
   try {
      const username = req.user.Username;
      const user = await userModel.findOne({ Username:username });
      
      if (!user) {
         return res.status(404).send('User not found' );
      }else{
      const familyMembers = user.familyMembers;
     console.log(familyMembers)
    res.send(familyMembers);
      }
   } catch (error) {
      console.error('Error retrieving family members:', error);
      res.status(500).send('Internal server error');
   }
};
const viewPrescribtion= async (req, res) => {
   try {
      const username = req.user.Username;
      const index=req.params.index;
      const user = await userModel.findOne({ Username: username});
      //console.log(user);
      if (!user) {
         return res.status(404).send('User not found' );
      }else{
      const Prescription = user.Prescriptions[index];
      res.send(Prescription)
      }
   } catch (error) {
      console.error('Error retrieving prescription:', error);
      res.status(500).send('Internal server error');
   }
}; 
const viewPrescriptions=async(req,res)=>{
   const username = req.user.Username;

   const profile = await userModel.findOne({ Username: username });
   const prescriptions = profile.Prescriptions;
   res.ssend(prescriptions);

}
const filterPrescriptions=async(req, res)=>{
   const username = req.user.Username;
   console.log('In filtered');
const status =req.body.prepStatus;
const date=req.body.prepDate;
const doctor=req.body.prepDr;
    const user = await userModel.findOne({ Username: username});
    let filteredPrescriptions = user.Prescriptions;
    let prescriptions;

    // Filter by doctor's username
    if (doctor !== 'null' && date==='' && status==='null' ) {
      prescriptions = filteredPrescriptions.filter((prescription) =>
      {
         return ( prescription.DocUsername === doctor );
      }
      
      );
    }
    if (date !== '' && doctor==='null' && status=='null') {
      const prepDate=new Date(date);

      prescriptions = filteredPrescriptions.filter((prescription) =>{
         console.log( prescription.PrecriptionDate)     ; 

         return (
          prescription.PrecriptionDate.getUTCDate() === prepDate.getUTCDate() &&
          prescription.PrecriptionDate.getUTCMonth() === prepDate.getUTCMonth() &&
          prescription.PrecriptionDate.getUTCFullYear() === prepDate.getUTCFullYear());
      }
      );
    }
    if (status !== 'null' && date==='' && doctor==='null') {
      prescriptions = filteredPrescriptions.filter((prescription) =>{
         return (        prescription.Status === status
            );
      }
      );

    }
    if(doctor!=='null' && date!=='' && status!=='null'){
      const prepDate=new Date(date);

      prescriptions = filteredPrescriptions.filter((prescription) =>{
         return (
            prescription.DocUsername === doctor &&
            prescription.Status === status &&
            prescription.PrecriptionDate.getUTCDate() === prepDate.getUTCDate() &&
            prescription.PrecriptionDate.getUTCMonth() === prepDate.getUTCMonth() &&
            prescription.PrecriptionDate.getUTCFullYear() === prepDate.getUTCFullYear());
      }
      );
    }
    if(doctor!=='null' && date!=='' && status==='null'){
      const prepDate=new Date(date);
      prescriptions = filteredPrescriptions.filter((prescription) =>{
         return (
            prescription.DocUsername === doctor &&
            prescription.PrecriptionDate.getUTCDate() === prepDate.getUTCDate() &&
            prescription.PrecriptionDate.getUTCMonth() === prepDate.getUTCMonth() &&
            prescription.PrecriptionDate.getUTCFullYear() === prepDate.getUTCFullYear());
      }
      );

    }
    if(doctor!=='null' && date==='' && status!=='null'){
      prescriptions = filteredPrescriptions.filter((prescription) =>{
         return (
            prescription.DocUsername === doctor &&
            prescription.Status === status ) 
      }
      );
    }
    if(doctor==='null' && date!=='' && status!=='null'){
      const prepDate=new Date(date);
      prescriptions = filteredPrescriptions.filter((prescription) =>{
         return (
            prescription.Status === status &&
            prescription.PrecriptionDate.getUTCDate() === prepDate.getUTCDate() &&
            prescription.PrecriptionDate.getUTCMonth() === prepDate.getUTCMonth() &&
            prescription.PrecriptionDate.getUTCFullYear() === prepDate.getUTCFullYear());
      }
      );
    }
    res.json(prescriptions);


}

const viewAvailDoctorAppointments = async (req, res) => {
   try {
     const selectedDoctorUsername = req.params.username; 
     console.log(selectedDoctorUsername)
 
     const selectedDoctor = await doctorModel.findOne({ Username: selectedDoctorUsername });
     console.log(selectedDoctor)

     
 
     if (!selectedDoctor) {
       return res.status(404).json({ message: 'Doctor not found' });
     }
 
     const doctorAppointments = selectedDoctor.Availability;
     console.log(doctorAppointments)
 
 
     res.status(200).json(doctorAppointments);
   } catch (error) {
     console.error('Error viewing doctor appointments:', error);
     res.status(500).json({ message: 'Internal server error' });
   }
 };

 const viewUpcomPastAppointments = async (req, res) => {
   try {
     const PatientUsername = req.params.username; 
 
     const patient = await userModel.findOne({ Username: PatientUsername });
     console.log(patient)
 
     if (!patient) {
       return res.status(404).json({ message: 'patient not found' });
     }
 
     const now = new Date();
     const upcomingAppointments = patient.BookedAppointments.filter(
       (appointment) => new Date(appointment.StartDate) > now
     );
     console.log(upcomingAppointments)
     const pastAppointments = patient.BookedAppointments.filter(
       (appointment) => new Date(appointment.EndDate) < now
     );
     console.log(pastAppointments)
 
     res.status(200).json({
       upcomingAppointments,
       pastAppointments,
     });
   } catch (err) {
     res.status(500).json({ error: err.message });
   }
 };
 const payAppointmentCash=async(req,res)=>{
   //add appointment to doctors booked app and patients booked app
const appointmentId=req.body.appid; //from doctor's available appointment;
const doctorUserName=req.body.doctorUsername;
const username=req.user.Username;
const user=await userModel.findOne({Username:username});
const doctor=await doctorModel.findOne({Username:doctorUserName});
const Appointment = doctor.Availability.find(
   (av) => {

      return ((av._id).toString()=== appointmentId)}
 );
 console.log(Appointment)
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
res.send("Appointment booked successfully");
}



const viewAllPacks=async(req,res)=>{
   const package=await packageModel.find().sort({createdAt:-1});
   if(package.length==0){
      res.status(404).send("No available health Packages at a moment");
   }
   res.send(package);
}



const subscribePackageCash=async(req,res)=>{
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
   for(let i=0;i<user.healthPackage.length;i++){
      if(user.healthPackage.Status=="Subscribed"){
         res.send("User Already Subscribed to a Package");
         break;
      }
   }
   // if(user.healthPackage.length!=0){
   //    res.send("User Already Subscribed to a Package");
   // }
   // if(user.WalletBalance<pack.Price){
   //    res.send("No Enough Balance");
   // }
   //else{
   const userPack=({
      _id:packageID,
      Package_Name:pack.Package_Name,
      Price:pack.Price,
      Session_Discount:pack.Session_Discount,
      Family_Discount:pack.Family_Discount,
      Pharmacy_Discount:pack.Pharmacy_Discount,
      Status:'Subscribed',
      Renewl_Date:  new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
   });
   user.healthPackage.push(userPack);
   // user.WalletBalance=user.WalletBalance-pack.Price;
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
//}
}


const viewPackageSubscribtion=async(req,res)=>{
   const userID=req.body.userId;
   const user=await userModel.findById(userID);
   if(!user){
      res.send("User Not Found");
   }
   else{
      if(user.healthPackage.length==0){
         res.send("User Not Subscribed to any Health Package");
      }
      else{
         if(user.healthPackage[0].Renewl_Date>new Date()){
            res.send(user.healthPackage);
         }
         else{
            user.healthPackage[0].Status='Unsubscribed';
            if(user.familyMembers.length!=0){
               for(let i=0;i<user.familyMembers.length;i++){
                  user.familyMembers[i].Family_Discount=0;
               }
            }
            await user.save();
            res.send(user.healthPackage);
         }
      }
   }
}

const cancelSubscription=async(req,res)=>{
   const userID=req.body.userId;
   const packageID=req.body.packageID;
   const pack=await packageModel.findById(packageID);
   const user=await userModel.findById(userID);
   if(user.healthPackage.length==0){
      res.send("User Not Subscribed");
   }
   for(let i=0;i<user.healthPackage.length;i++){
      if(user.healthPackage[i]._id==packageID){
         user.healthPackage.pop();
         const userPack=({
            _id:packageID,
            Package_Name:pack.Package_Name,
            Price:pack.Price,
            Session_Discount:pack.Session_Discount,
            Family_Discount:pack.Family_Discount,
            Pharmacy_Discount:pack.Pharmacy_Discount,
            Status:'Cancelled',
            End_Date: new Date(),
         });
         user.healthPackage.push(userPack);
      }
   }
   if(user.familyMembers.length!=0){
      for(let i=0;i<user.familyMembers.length;i++){
         user.familyMembers[i].Family_Discount=0;
      }
   }
   await user.save();
   res.send(user.healthPackage);

   
}
const linkPatientAsFamilyMember = async (req, res) => {
   try {
      const linkingUserUsername = req.user.Username; // The username of the user initiating the link
      const linkTargetEmailOrPhone = req.params.emailOrPhone; // Email or phone number of the user to link
      const relation = req.params.relation; // Relation (wife, husband, child, etc.)
      console.log('linkTargetEmailOrPhone:', linkTargetEmailOrPhone);


      
      let linkedUser;
      if (linkTargetEmailOrPhone.includes('@')) {
         
         linkedUser = await userModel.findOne({ Email: linkTargetEmailOrPhone });
      } else {
         linkedUser = await userModel.findOne({ MobileNumber: linkTargetEmailOrPhone });
      }

      if (!linkedUser) {
         return res.status(404).json({ message: 'User to link not found' });
      }

      const linkingUser = await userModel.findOne({ Username: linkingUserUsername });

      if (!linkingUser) {
         return res.status(404).json({ message: 'User not found' });
      }

      if (!isValidRelation(relation)) {
         return res.status(400).json({ message: 'Invalid relation' });
      }

      const linkedFamilyMember = {
         memberID: linkedUser.id, 
         username: linkedUser.Username, 
         relation:relation,
      };

      if (!linkingUser.LinkedPatientFam) {
         linkingUser.LinkedPatientFam = [];
      }

      linkingUser.LinkedPatientFam.push(linkedFamilyMember);

      await linkingUser.save();
      res.status(200).send("Family Member linked successfully");

   } catch (error) {
      console.error('Error linking family member:', error);
      res.status(500).json({ message: 'Internal server error' });
   }
}
function isValidRelation(relation) {
   const allowedRelations = ['wife', 'husband', 'child', 'other'];
   return allowedRelations.includes(relation);
}



module.exports = {selectedDoctorDetails,addFamilyMem,viewAvailDoctorAppointments,searchDoctors, getUsers,
   searchAppointments,viewALLAppointments,
   viewDoctors,viewFamilyMembers,viewPrescribtion,
   filterPrescriptions,viewPrescriptions,
   viewPrescribtion, viewPatientWallet,cancelSubscription,
   viewUpcomPastAppointments,payAppointmentCash,viewAllPacks,subscribePackageCash,viewPackageSubscribtion,linkPatientAsFamilyMember};
