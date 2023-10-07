// const Doctor = require('../models/doctor');
const docModel = require('../Models/Doc_Request.js'); //Doctor Applications database:still waiting on approval by admin
const doctorModel = require('../Models/Doctor.js');// Database of doctors on the platform:accepted by admin 
const userModel = require('../Models/User.js');// Database of doctors on the platform:accepted by admin 

const { default: mongoose } = require('mongoose');


// CREATE a new doctor
const createDocReq = async (req, res) => {
    console.log(req.body.name);
    // register as a doctor using username, name, email, password, date of birth,
    //  hourly rate, affiliation (hospital), educational background. 

    const doc = new docModel({
       Username: req.body.username, 
       Name: req.body.name, 
       Email:req.body.email, 
       Password:req.body.password,
       DateOfBirth: req.body.dob,
       HourlyRate: req.body.hourly_rate,
       Affiliation: req.body.affiliation,
       EducationalBackground: req.body.educational_background       
       });

       //check for duplicate username
      const docExists = await docModel.findOne({Username: req.body.username});
      if (docExists) return res.status(400).send("Username already exists");
       
    doc.save(function(err){
       if (err) {
          throw err;
       }
       console.log('INSERTED!');
 
   });
   // res.render('patient_home');
    res.status(200).send("Your Request has been sent to the admin.")
 }
 const viewProfile= async(req,res)=>{
   // const applicationId = req.params.id;
     const profile = await doctorModel.findOne({});
     res.render('doc_profile_view.ejs', { profile });
 
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
     res.render('doc_profile_edit.ejs', { profile });
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
         res.render('doc_profile_view.ejs', { profile });
       } catch (error) {
         console.error(error);
         res.status(500).send('Internal Server Error');
       }
 
  }

  const viewMyPatients= async(req,res)=>{
    // const applicationId = req.params.id;
    const profile = await doctorModel.findOne({ Username: "Dr.DS" });
    const appointments = profile.BookedAppointments
    console.log('the doc:' , appointments);
    res.render('myPatients.ejs', { appointments });
  
   }

   const selectPatient= async(req,res)=>{
    // http://localhost:8000/doctor/viewPatient?username=pep
    const { username } = req.query;
    const profile = await userModel.findOne({Username: username});
    res.render('viewPatient.ejs', { profile });
   }
 


module.exports = {
    createDocReq,viewProfile,editView,editProfile,
    viewMyPatients,
    selectPatient
};
