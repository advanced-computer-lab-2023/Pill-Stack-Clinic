const docModel = require('../Models/Doc_Request.js'); //Doctor Applications database:still waiting on approval by admin
const doctorModel = require('../Models/Doctor.js');// Database of doctors on the platform:accepted by admin 
const userModel = require('../Models/User.js');// Database of users on the platform

const { default: mongoose } = require('mongoose');



 const viewProfile= async(req,res)=>{
  const username = req.user.Username;
  const profile = await doctorModel.findOne({Username:username});
     res.send(profile);
 
  }
 
  const editView=async(req,res)=>{
    const { id } = req.params;
 
   try {
     // Find the profile by _id and email
     const profile = await doctorModel.findOne({ _id: id});
     if (!profile) {
       return res.status(404).send('Profile not found');
     }
 
     // Render the edit email form with the profile data
     res.send(profile);
   } catch (error) {
     console.error(error);
     res.status(500).send('Internal Server Error');
   }
 
  }
  const editProfile=async(req,res)=>{
    
       const { id } = req.params;
     
       try {
         const profile = await doctorModel.findById(id);
         if (!profile) {
           return res.status(404).send('Profile not found');
         }
     
         // Update the specific fields based on form submission
         profile.Email = req.body.email;
         profile.HourlyRate = req.body.hourlyRate;
         profile.Affiliation = req.body.affiliation;
     
         await profile.save();
     
         // Redirect back to the profile view or show a success message
         res.send(profile);
       } catch (error) {
         console.error(error);
         res.status(500).send('Internal Server Error');
       }
 
  }

  const viewMyPatients= async(req,res)=>{
    const username = req.user.Username;
    const profile = await doctorModel.findOne({ Username: username });
    const appointments = profile.BookedAppointments
    console.log('the doc:' , appointments);
res.send(appointments);  
   }

   const selectPatient= async(req,res)=>{
    // http://localhost:8000/doctor/viewPatient?username=pep
    const { username } = req.query;
    const profile = await userModel.findOne({Username: username});
    res.send(profile);
   }
   const searchAppointments =async(req,res)=>{
    const username = req.user.Username;

    const appStatus=req.body.status;
    let BookedAppointments;
   const user = await doctorModel.findOne({ Username: username });
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
 
 
 
 console.log(BookedAppointments)
 res.send(BookedAppointments);
 
 }
 const viewALLAppointments =async(req,res)=>{
  const username = req.user.Username;
  const profile = await doctorModel.findOne({ Username: username });
  const BookedAppointments = profile.BookedAppointments;
  res.send(BookedAppointments);


 }

 const viewDoctorWallet = async (req, res) => {
  try {
    const doctorId = req.user.id; // Assuming you have user ID available in req.user

    const doctor = await doctorModel.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    res.json({ WalletBalance: doctor.WalletBalance });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

 const PostByName= async(req,res)=>{
  const username = req.user.Username;
  const profile = await doctorModel.aggregate([
    {
      $match: {
        Username: username
      }
    },
    {
      $unwind: "$BookedAppointments"
    },
    {
      $match: {
        "BookedAppointments.PatientName": {
          $regex: req.body.search, "$options": "i",
          $options: "i"
        }
      }
    },
    {
      $project: {
        _id: 0, // Exclude the _id field from the result
        PatientUsername: "$BookedAppointments.PatientUsername",
      }
    }
  ]);
// working 
  // let found = []
  // found=await userModel.find({Username:profile[0].PatientUsername});
// </working>
// let found = [];
// Create an array of promises
const promises = profile.map(async (item) => {
  const user = await userModel.find({ Username: item.PatientUsername });
  return user;
});

// Use Promise.all to await all the promises
const found1 = await Promise.all(promises);

  const found=found1.flat();
   res.send(found);
  
 
 }

 const viewUpcomPastAppointments = async (req, res) => {
  try {
    const doctorUsername = req.params.username; // Assuming you have the username of the logged-in doctor in req.user.username

    const doctor = await doctorModel.findOne({ Username: doctorUsername });
    console.log(doctor)

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Separate upcoming and past appointments
    const now = new Date();
    const upcomingAppointments = doctor.BookedAppointments.filter(
      (appointment) => new Date(appointment.StartDate) > now
    );
    console.log(upcomingAppointments)
    const pastAppointments = doctor.BookedAppointments.filter(
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
const addAppointments=async(req,res)=>{
  const{startDate,endDate}=req.body;
const doctor=await doctorModel.findOne({Username:req.user.Username});
const docApp=({
 _id: mongoose.Types.ObjectId(),
  StartDate:startDate,
  EndDate:endDate,
});
doctor.Availability.push(docApp);
doctor.save();
res.send("Appointment added sucessfully");
}

module.exports = {
    viewProfile,editView,editProfile,
    viewMyPatients,
    selectPatient,
    searchAppointments,viewALLAppointments,
    PostByName, viewDoctorWallet,
    viewUpcomPastAppointments,
    addAppointments

};
