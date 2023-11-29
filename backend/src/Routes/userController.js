// #Task route solution
const userModel = require('../Models/User.js');
const { default: mongoose } = require('mongoose');
const doctorModel = require('../Models/Doctor.js');// Database of doctors on the platform:accepted by admin 
const packageModel=require('../Models/Packages.js');
const orderModel=require('../Models/Order.js');
const path = require('path');
const fs = require('fs');
const sendEmail = require("../Utilities/SendEmail");



 
 // Function to remove a medical history document
 const removeMedicalDocument = async (req, res) => {
   try {
     const user = req.user;
     const documentId = req.params.documentId;
 
     // Find the document in the user's medicalHistory and remove it
     const document = user.medicalHistory.id(documentId);
     if (document) {
       // Remove the file from the server
       fs.unlinkSync(/* update with the correct path */ document.path);
       document.remove();
       await user.save();
       res.status(200).json({ message: 'Document removed successfully' });
     } else {
       res.status(404).json({ message: 'Document not found' });
     }
   } catch (error) {
     console.error('Error removing medical document:', error);
     res.status(500).json({ message: 'Internal server error' });
   }
 };
 const viewProfile= async(req,res)=>{
   const username = req.user.Username;
   const profile = await userModel.findOne({Username:username});
      res.send(profile);
  
   }



const addFamilyMem = async (req, res) => {
   try {
      const username = req.user.Username;

      const user = await userModel.findOne({ Username: username });

      if (!user) {
         return res.status(404).json({ message: 'User not found' });
      }

      console.log(req.body.username)

      // iff all inputs are not empty
      if (req.body.username && req.body.nationalID &&  req.body.age && req.body.gender && req.body.relation)
      {
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
   } 
   else {
      res.status(400).send("Please fill all inputs")
   }

   } catch (error) {
      console.error('Error adding family member:', error);
      res.status(500).json({ message: 'Internal server error' });
   }
}

const uploadMedicalDocument = async (req, res) => {
   try {
     const user = req.user;
     const { originalname, path } = req.file;
 
     // Save document information to the user's medicalHistory
     user.medicalHistory.push({ name: originalname, path: path });
     await user.save();
 
     res.status(201).json({ message: 'Document uploaded successfully' });
   } catch (error) {
     console.error('Error uploading medical document:', error);
     res.status(500).json({ message: 'Internal server error' });
   }
 };


const searchDoctors = async (req, res) => {
   try {
       const { name, speciality, startDate, endDate  } = req.body;
       let query = {};
       console.log(startDate);
       console.log(endDate);

       if (name) {
         query["Name"] = { $regex: new RegExp(`.*${name}.*`, 'i') };
       }

       if (speciality) {
           query["Speciality"] = { $regex: new RegExp(speciality, 'i') };
       }

      // if (date) {
      //    const dateFormatted = new Date(`${date}T${time}:00.000Z`);
      //    query["Availability.StartDate"] =  dateFormatted ;
      // }
      var doctors = await doctorModel.find(query);

      if(startDate){
      let newDoc=[];
       doctors.forEach((doctor)=>{
         let newAvailability=[]
         doctor.Availability.forEach((availability)=>{
            const appStartDate=new Date(availability.StartDate);
            const formattedAppointmentStartDate = appStartDate.toISOString().split('T')[0];
            if(formattedAppointmentStartDate>=startDate && formattedAppointmentStartDate<=endDate){
               newAvailability.push(availability);
            }
         })
         doctor.Availability=newAvailability;
         if(newAvailability.length>0){
            newDoc.push(doctor);
         }
       })
       doctors=newDoc;
      }
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
   const currDate=new Date();
   for (const app of BookedAppointments) {
     if(app.StartDate<currDate){
      app.Status='completed';
     }
    }
    profile.save();
   res.status(200).json(profile.BookedAppointments);
 
 
  }
  //Used for manually linked members,not linked to an account 
  const viewFamilyAppointments =async(req,res)=>{
   const username = req.user.Username;
   const profile = await userModel.findOne({ Username: username });
   const familyAppointments = profile.FamilyBookedAppointments;
   const currDate=new Date();
   for (const app of familyAppointments) {
     if(app.StartDate<currDate){
      app.Status='completed';
     }
    }
    profile.save();
   res.status(200).json(profile.FamilyBookedAppointments);
 
 
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
 const getAmount = async (req, res) => {
   const docUsername = req.body.doctor;
   const username = req.user.Username;
   const user = await userModel.findOne({ Username: username });
   const doctor = await doctorModel.findOne({ Username: docUsername });
   const healthPackage = user.healthPackage;
   let userPrice;
   let familyPrice;
 
   if (!healthPackage || healthPackage.length === 0) {
     userPrice = doctor.HourlyRate * 1.1;
     familyPrice = userPrice;
   } else {
     for (const pack of healthPackage) {
       if (pack.Status === 'Subscribed') {
         const fullPackage = await packageModel.findOne({ Package_Name: pack.Package_Name });
         const discount = fullPackage.Session_Discount / 100;
         const familyDiscount = fullPackage.Family_Discount / 100;
         const date = new Date();
 
         if (pack.Renewl_Date >= date) {
           if (pack.Owner) {
             userPrice = (doctor.HourlyRate * 1.1) * (1 - discount);
             familyPrice = (doctor.HourlyRate * 1.1) * (1 - familyDiscount);
           } else {
             userPrice = (doctor.HourlyRate * 1.1) * (1 - familyDiscount);
             familyPrice = doctor.HourlyRate * 1.1;
           }
         }
       }
     }
 
     if (userPrice === undefined && familyPrice === undefined) {
       userPrice = doctor.HourlyRate * 1.1;
       familyPrice = userPrice;
     }
   }
 
   res.send({ userPrice: userPrice, familyPrice: familyPrice });
 };
 
const viewDoctors = async (req, res) => {
   try {
      const doctors = await doctorModel.find();
     const userId = req.user.id;
     const user = await userModel.findById(userId);
      if (user) {
         var discount=0;
         const healthPackage = user.healthPackage;
         if (healthPackage && healthPackage.length !== 0) {
            for (const pack of healthPackage) {
               if (pack.Status === 'Subscribed') {
                  const date = new Date();
                  if (pack.Renewl_Date >= date) {
                     const fullPackage = await packageModel.findOne({ Package_Name: pack.Package_Name });
                     if (pack.Owner) {
                        discount=fullPackage.Session_Discount/100;
                      } else {
                        discount=fullPackage.Family_Discount/100;  
                      }
                  }
               }
            }
         }
         const updatedDoctors = doctors.map((doctor) => {
            return {
               username:doctor.Username,
               name: doctor.Username,
               price: Math.ceil((doctor.HourlyRate * 1.1) * (1 - discount)),
               speciality: doctor.Speciality,
               availability: doctor.Availability.map((availability) => ({
                  StartDate: availability.StartDate,
                  EndDate: availability.EndDate,
                })),
               
                affiliation:doctor.Affiliation,
                background:doctor.EducationalBackground
            };
         });
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
//added family members and linked family members accounts//edited for frontend
const viewFamilyMembers = async (req, res) => {
   try {
      const username = req.user.Username;
      const user = await userModel.findOne({ Username:username });
      
      if (!user) {
         return res.status(404).send('User not found' );
      }else{
      const familyMembers = user.familyMembers;
      const linkedIDs=user.LinkedPatientFam; 
      //console.log(linkedIDs);
      const linkedAccounts=[];
      for (const userId of linkedIDs) {
         const famMember = await userModel.findById(userId.memberID);
         linkedAccounts.push(famMember);
       }

    res.send({added:familyMembers,linkedAccounts:linkedAccounts});
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
const viewPrescriptions = async (req, res) => {
   try {
     const username = req.user.Username;
     console.log(username + "DODDDDDDDDDYYYY");
     const profile = await userModel.findOne({ Username: username });
     const prescriptions = profile.Prescriptions;
 
     // Map the prescriptions to extract Medicine details
     const mappedPrescriptions = prescriptions.map((prescription) => {
       const medicineDetails = prescription.Medicine.map((medicine) => ({
         MedicineID: medicine.MedicineID,
         Quantity: medicine.Quantity,
         Instructions: medicine.Instructions,
       }));
       return {
         Medicine: medicineDetails,
         DocUsername:prescription.DocUsername,
         Date:prescription.PrecriptionDate,
         Status: prescription.Status,
       };
     });
 
     console.log(mappedPrescriptions);
 
     res.send(mappedPrescriptions);
   } catch (error) {
     console.error('Error fetching prescriptions:', error);
     res.status(500).send({ error: 'An error occurred while fetching prescriptions.' });
   }
 };
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
//gets all appointments for all docs
const viewAllAvailableAppointments = async (req, res) => {
   try {
     const selectedDoctor = await doctorModel.find({});
     var app=[];
     const currDate=new Date();
     selectedDoctor.forEach(doctor => {
      if(doctor.Availability.length!==0){
      for (const app of doctor.Availability) {
         if(app.StartDate<currDate){
           doctor.Availability.remove(app);
         }
        }
        doctor.save();
      app.push(doctor.Availability);
      }
     });
   
     res.status(200).json(selectedDoctor);
   } catch (error) {
     console.error('Error viewing doctor appointments:', error);
     res.status(500).json({ message: 'Internal server error' });
   }
 };


const viewAvailDoctorAppointments = async (req, res) => {
   try {
     const selectedDoctorUsername = req.params.username;  
     const selectedDoctor = await doctorModel.findOne({ Username: selectedDoctorUsername });
     if (!selectedDoctor) {
       return res.status(404).json({ message: 'Doctor not found' });
     }
     const doctorAppointments = selectedDoctor.Availability;
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
 const payAppointmentWallet=async(req,res)=>{
   const amount=req.body.amount;
   const wallet=req.user.WalletBalance;
   const linkedFamMember=req.body.member; //let it be ID
   const manualFamMember=req.body.manualMem;
   if(amount>wallet){
      res.send('Not enough wallet Balance');
   }else{
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
    if(!linkedFamMember){
      if(manualFamMember){
         const docApp=({
            _id:Appointment._id,
            PatientUsername:username,
            PatientName:manualFamMember,
            StartDate:Appointment.StartDate,
            EndDate:Appointment.EndDate,
            Price:amount,
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
            Price:amount,
            Status:'upcoming',
         });
         user.FamilyBookedAppointments.push(userApp);
      }else{
         const docApp=({
            _id:Appointment._id,
            PatientUsername:username,
            PatientName:req.user.Name,
            StartDate:Appointment.StartDate,
            EndDate:Appointment.EndDate,
            Price:amount,
            Status:'upcoming',
         });
         doctor.BookedAppointments.push(docApp);
         const userApp=({
            _id:Appointment._id,
            DoctorUsername:doctorUserName,
            DoctorName:doctor.Name,
            StartDate:Appointment.StartDate,
            EndDate:Appointment.EndDate,
            Price:amount,
            Status:'upcoming',
         });
         user.BookedAppointments.push(userApp);

      }
 
    }else{
      const familyMember=await userModel.findById(linkedFamMember);
   
      const docApp=({
         _id:Appointment._id,
         PatientUsername:familyMember.Username,
         PatientName:familyMember.Name,
         StartDate:Appointment.StartDate,
         EndDate:Appointment.EndDate,
         Price:amount,
         Status:'upcoming',
      });
      doctor.BookedAppointments.push(docApp);
      const userApp=({
         _id:Appointment._id,
         DoctorUsername:doctorUserName,
         DoctorName:doctor.Name,
         StartDate:Appointment.StartDate,
         EndDate:Appointment.EndDate,
         Price:amount,
         Status:'upcoming',
      });
      familyMember.BookedAppointments.push(userApp);
      familyMember.save();
     
      
   
   
    }
   doctor.Availability.remove({_id:appointmentId});
   const docBalance=doctor.WalletBalance+(0.9*amount);
   doctor.WalletBalance=docBalance;
   const formattedDate = Appointment.StartDate.toLocaleDateString();
   const formattedTimeStart = Appointment.StartDate.toLocaleTimeString();
   const formattedTimeEnd = Appointment.EndDate.toLocaleTimeString();
   const notification = ` Your new appointment is scheduled for ${formattedDate} at ${formattedTimeStart} to ${formattedTimeEnd} .`;
   doctor.Notifications.push(notification);
   doctor.save();
   user.WalletBalance=wallet-amount;
   user.Notifications.push(notification);
   user.save();
   const emailText = `Hello, Your new appointment is scheduled for ${formattedDate} at ${formattedTimeStart} to ${formattedTimeEnd} .`;
   await sendEmail(user.Email, "New Appointment ",emailText );
   await sendEmail(doctor.Email,"New Appointment",emailText)
   res.send("Appointment booked successfully");
   }

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
   console.log(packageID);
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
   if(user.WalletBalance<pack.Price){
      res.send("No Enough Balance");
      return;
   }
   else{
      for(let i=0;i<user.healthPackage.length;i++){
         if(user.healthPackage[i].Owner==true){
         user.healthPackage[i].remove();
         await user.save();
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
      Owner:true,
   });
   user.healthPackage.push(userPack);
   await user.save();
   user.WalletBalance=user.WalletBalance-pack.Price;
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
            let bool=linkedFam.healthPackage[j].Status!='Subscribed';
            console.log(bool );
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
         SortPackByOwner(linkedFam);
         await linkedFam.save();
   }
   }
}
   res.send("Subscribed succsefully");
   SortPackByOwner(user);
   await user.save();
}
//}
const checkSubscribed=(async(req,res)=>{
   const username=req.body.username;
   console.log(username);
   const user=await userModel.findOne({Username:username});
   for(let i=0;i<user.healthPackage.length;i++){
      if(user.healthPackage[i].Owner===true && user.healthPackage[i].Status==='Subscribed'){
         res.send("User is already Subscribed to "+user.healthPackage[i].Package_Name);
         return;
      }
   }
   res.send("ok");
})

function SortPackByOwner(user){
   let arr = new Array();
   let arr2=new Array();
   for(let i=0;i<user.healthPackage.length;i++){
      if(user.healthPackage[i].Owner==true){
         arr.push(user.healthPackage[i]);
      }
      else{
         arr2.push(user.healthPackage[i]);
      }
   }
   for(let i=0;i<user.healthPackage.length+1;i++){
         user.healthPackage.pop();
}
for(let i=0;i<arr.length;i++){
   user.healthPackage.push(arr[i]);   
}
for(let i=0;i<arr2.length;i++){
   user.healthPackage.push(arr2[i]);   
}
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
         for(let i=0;i<user.healthPackage.length;i++){
         if(user.healthPackage[i].Renewl_Date<new Date()){
            user.healthPackage[i].Status='Unsubscribed';
            await user.save();
         }
         }
         res.send(user.healthPackage);
      }
   }
}

const cancelAppointment = async (req, res) => {
   try {
     const appointmentId = req.body.appointmentId;
     const username = req.user.Username;
 
     const user = await userModel.findOne({ Username: username });
     const appointment = user.BookedAppointments.find((app) => app._id.toString() === appointmentId);
 
     if (!appointment) {
       return res.status(404).json({ error: 'Appointment not found' });
     }
 
     const currentDate = new Date();
     const startDate = new Date(appointment.StartDate);
 
     if (startDate - currentDate < 24 * 60 * 60 * 1000) {
       // Cancel normally
       appointment.Status = 'cancelled';
       console.log('Cancelled appointment with no refund');
 
       // Send a response to the frontend with refund:false
       res.status(200).json({ message: 'Appointment cancelled successfully', refund: false });
     } else {
       // Cancel with refund
       appointment.Status = 'cancelled';
       console.log('Cancelled appointment with refund!');
 
       // Send a response to the frontend with refund:true
       res.status(200).json({ message: 'Appointment cancelled successfully', refund: true });
     }
 
     await user.save();
   } catch (error) {
     console.error('Error cancelling appointment:', error);
     res.status(500).json({ error: 'Internal Server Error' });
   }
 };
 


const cancelSubscription=async(req,res)=>{
   const userID=req.body.userId;
   const packageID=req.body.packageID;
   const pack=await packageModel.findById(packageID);
   const user=await userModel.findById(userID);
   if(user.healthPackage.length==0){
      res.send("User Not Subscribed");
      return;
   }
   let bool=false;
   for(let i=0;i<user.healthPackage.length;i++){
      if(user.healthPackage[i]._id==packageID && user.healthPackage[i].Owner==true){
         bool=true;
         user.healthPackage[i].remove();
         const userPack=({
            _id:packageID,
            Package_Name:pack.Package_Name,
            Price:pack.Price,
            Session_Discount:pack.Session_Discount,
            Family_Discount:pack.Family_Discount,
            Pharmacy_Discount:pack.Pharmacy_Discount,
            Status:'Cancelled',
            Owner:true,
            End_Date: new Date(),
         });
         user.healthPackage.push(userPack);
      }
   }
   if(bool ==false){
      res.send("You cannot Cancel linked Package");
      return;
   }
   if(user.LinkedPatientFam.length==0){
      console.log("No Linked family members");
   }
   else{
      for(let i=0;i<user.LinkedPatientFam.length;i++){
         const linkedFam = await userModel.findById(user.LinkedPatientFam[i].memberID);
         for(let j=0;j<linkedFam.healthPackage.length;j++){
         if(linkedFam.healthPackage[j]._id==packageID && linkedFam.healthPackage[j].Owner==false){
            linkedFam.healthPackage[j].remove();
         const userPack=({
            _id:packageID,
            Package_Name:pack.Package_Name,
            Price:pack.Price,
            Session_Discount:pack.Session_Discount,
            Family_Discount:pack.Family_Discount,
            Pharmacy_Discount:pack.Pharmacy_Discount,
            Status:'Cancelled',
            End_Date:  new Date(),
            Owner:false,
         });
         linkedFam.healthPackage.push(userPack);
         await linkedFam.save();}
      }
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
      let relationFor="";
      if(relation == "husband"){
         relationFor="wife";
      }
      if(relation == "wife"){
         relationFor="husband";
      }
      if(relation == "child"){
         relationFor="Father/Mother";
      }
      const linkingFamilyMember = {
         memberID: linkingUser.id, 
         username: linkingUser.Username,
         relation:relationFor,
      };

      if (!linkingUser.LinkedPatientFam) {
         linkingUser.LinkedPatientFam = [];
      }

      linkingUser.LinkedPatientFam.push(linkedFamilyMember);
      linkedUser.LinkedPatientFam.push(linkingFamilyMember);
      if(linkingUser.healthPackage.length!=0){
         for(let i=0;i<linkingUser.healthPackage.length;i++){
            if(linkingUser.healthPackage[i].Status=='Subscribed'&& linkingUser.healthPackage[i].Owner==true){
               const userPack=({
                  _id:linkingUser.healthPackage[i]._id,
                  Package_Name:linkingUser.healthPackage[i].Package_Name,
                  Price:linkingUser.healthPackage[i].Price,
                  Session_Discount:linkingUser.healthPackage[i].Session_Discount,
                  Family_Discount:linkingUser.healthPackage[i].Family_Discount,
                  Pharmacy_Discount:linkingUser.healthPackage[i].Pharmacy_Discount,
                  Status:'Subscribed',
                  Renewl_Date:  new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                  Owner:false,
               });
               linkedUser.healthPackage.push(userPack);
               await linkedUser.save();
            }
         }
      }
      if(linkedUser.healthPackage.length!=0){
         for(let i=0;i<linkedUser.healthPackage.length;i++){
            if(linkedUser.healthPackage[i].Status=='Subscribed'&& linkedUser.healthPackage[i].Owner==true){
               const userPack=({
                  _id:linkedUser.healthPackage[i]._id,
                  Package_Name:linkedUser.healthPackage[i].Package_Name,
                  Price:linkedUser.healthPackage[i].Price,
                  Session_Discount:linkedUser.healthPackage[i].Session_Discount,
                  Family_Discount:linkedUser.healthPackage[i].Family_Discount,
                  Pharmacy_Discount:linkedUser.healthPackage[i].Pharmacy_Discount,
                  Status:'Subscribed',
                  Renewl_Date:  new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                  Owner:false,
               });
               linkingUser.healthPackage.push(userPack);
               await linkingUser.save();
            }
         }
      }
      await linkedUser.save();
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

const viewMyHealthRecords = async (req, res) => {
   try {
     const username = req.params.Username;
     const patientName = req.params.Patientname;
      console.log(username);
      console.log(patientName)
     const user = await userModel.findOne({ Username: username });
     if (!user) {
       return res.status(404).json({ message: 'User not found' });
     }
     const healthRecords = user.HealthRecords.filter(record => record.PatientName === patientName);
     if (healthRecords.length === 0) {
       return res.status(404).json({ message: 'Health records not found for the specified patient' });
     }
 
     return res.status(200).json({ healthRecords });
   } catch (error) {
     console.error(error);
     return res.status(500).json({ message: 'Internal server error' });
   }
 };
 ///////Pharamcy add on
 const orderDetails = async (req, res) => {
   console.log("DAREEENNN");
   const id = req.user._id;
   const objectIdValue = id.valueOf();
   console.log(objectIdValue);
 
   try {
     // Use await to wait for the result of the query
     const orders = await orderModel.find({ userId: objectIdValue });
 
     if (!orders || orders.length === 0) {
       // Handle the case where no orders are found
       return res.status(404).send({ message: "Orders not found" });
     }
 
     // Map through each order and extract details
     const orderDetailsArray = orders.map((order) => ({
       _id:order._id,
       Status: order.status,
       Items: order.items,
       address: order.address,
       bill: order.bill,
       dateAdded: order.date_added,
     }));
 
     res.send(orderDetailsArray);
   } catch (error) {
     console.error('Error fetching order details:', error);
     res.status(500).send({ message: 'Internal Server Error' });
   }
 };
 const getAddresses=async(req,res)=>{
   const username=req.user.Username;
   const user=await userModel.findOne({Username:username});
   if(user){
    const address=user.DeliveryAddress;
    res.send(address);
 
   }else{
    res.send('could not find user');
   }
 }
 const addDeliveryAddress = async (req, res) => {
   const username = req.params.username;
   const newAddress = req.body.address; // Assuming the new address is sent in the request body
   console.log(username)
   try {
     // Find the user by their username
     const user = await userModel.findOne({ Username: username });
     console.log(user)
 
     if (user) {
       // Add the new address to the DeliveryAddress array
       user.DeliveryAddress.push(newAddress);
 
       // Save the updated user document
       await user.save();
 
       res.send('Delivery address added successfully');
     } else {
       res.send('Could not find the user');
     }
   } catch (error) {
     console.error('Error adding delivery address:', error);
     res.status(500).send('Internal server error');
   }
 };


module.exports = {selectedDoctorDetails,addFamilyMem,
   viewAllAvailableAppointments,getAmount,
   viewAvailDoctorAppointments,searchDoctors, getUsers,
   searchAppointments,viewALLAppointments,
   viewDoctors,viewFamilyMembers,viewPrescribtion,
   filterPrescriptions,viewPrescriptions,viewProfile,
   viewPrescribtion, viewPatientWallet,cancelSubscription,cancelAppointment,
   viewUpcomPastAppointments,payAppointmentWallet,
   viewAllPacks,subscribePackageCash,viewPackageSubscribtion,
   linkPatientAsFamilyMember, uploadMedicalDocument,checkSubscribed,
    removeMedicalDocument,viewFamilyAppointments,viewMyHealthRecords,
    orderDetails,getAddresses,addDeliveryAddress
   
   
   
   
   
   
   
   
   
   
   
   };
