const docModel = require('../Models/Doc_Request.js'); //Doctor Applications database:still waiting on approval by admin
const doctorModel = require('../Models/Doctor.js');// Database of doctors on the platform:accepted by admin 
const userModel = require('../Models/User.js');// Database of users on the platform
const Contract = require('../Models/contract.js');
const { default: mongoose } = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');



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
const updateContractStatus=async(req,res)=>{
  const username= req.body.username;
  doctorModel.findOneAndUpdate(
    { Username: username },
    { $set: { ContractStatus: true } },
    (err, doctor) => {
      if (err) {
        console.error('Error updating contract status:', err);
        console.log(doctor.contractStatus);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      if (!doctor) {
        return res.status(404).json({ error: 'Doctor not found' });
      }
      res.status(200).json({ success: true });
    }
  );
}
  
  const editProfileInfo = async (req, res) => {
    const { id } = req.params;
  
    try {
      const profile = await doctorModel.findById(id);
      if (!profile) {
        return res.status(404).send('Profile not found');
      }
  
      // Update the specific fields based on the JSON data sent in the request body
      profile.Email = req.body.email;
      profile.HourlyRate = req.body.HourlyRate;
      profile.Affiliation = req.body.affiliation;
  
      await profile.save();
  
      // Send the updated profile as a response
      res.json(profile);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  };



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
    res.send(appointments);  
   }

   const selectPatient= async(req,res)=>{
    // http://localhost:8000/doctor/viewPatient?username=pep

    const  username  = req.body.username;
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

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Separate upcoming and past appointments
    const now = new Date();
    const upcomingAppointments = doctor.BookedAppointments.filter(
      (appointment) => new Date(appointment.StartDate) > now
    );
    const pastAppointments = doctor.BookedAppointments.filter(
      (appointment) => new Date(appointment.EndDate) < now
    );

    res.status(200).json({
      upcomingAppointments,
      pastAppointments,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const scheduleAppointment = async (req, res) => {
  try {
    const doctorId=req.user._id;
    const doctor = await doctorModel.findById(doctorId);
   // if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    
    const appointment = {
      PatientUsername: req.body.PatientUsername,
      PatientName: req.body.PatientName,
      StartDate: req.body.StartDate,
      EndDate: req.body.EndDate,
      Status: 'upcoming' // default status for a new appointment
    };

    doctor.BookedAppointments.push(appointment);

    await doctor.save();
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const viewContract = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ Username: req.user.Username }).exec();

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const contract = await Contract.findOne({ DoctorId: doctor._id }).exec();

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    res.status(200).json(contract);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

const deleteContract = async (req, res) => {
  try {
    const contractId = req.params.contractId;

    // Check if the contract exists
    const contract = await Contract.findById(contractId);
    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }await Contract.findByIdAndDelete(contractId);
    res.status(200).json({ message: 'Contract deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



 //e


  // Define storage location for uploaded documents

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Define the folder where files will be stored
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const extname = path.extname(file.originalname); // Get the file extension
      cb(null, file.fieldname + '-' + uniqueSuffix + extname);
    },
  });

  // Create multer middleware with storage configuration
  const upload = multer({ storage: storage });

  // // Import doctor and user models "already done above"
  // const doctorModel = require('../Models/Doctor.js');
  // const userModel = require('../Models/User.js');

  // // ...

  // Handle file uploads for document submission during registration
  const uploadGeneralFiles = upload.fields([
    { name: 'idDocument', maxCount: 1 },
    { name: 'medicalLicenseDocument', maxCount: 1 },
    { name: 'medicalDegreeDocument', maxCount: 1 }
  ]);

  // Register a new doctor, including document uploads
  // const registerDoctor = async (req, res) => {
  //   // Use the uploadDocuments middleware to handle file uploads
  //   uploadGeneralFiles(req, res, async (err) => {
  //     if (err) {
  //       return res.status(500).json({ error: 'Error uploading documents.' });
  //     }

  //     // Extract other registration data from the request body
  //     const {Username, Name, Email, Password, DateOfBirth, HourlyRate, Affiliation, EducationalBackground, idDocument, medicalLicenseDocument, medicalDegreeDocument } = req.body;

  //     // Create a new doctor with the extracted data
  //     const newDoctor = new doctorModel({
  //       Username,
  //       Name,
  //       Email,
  //       Password,
  //       DateOfBirth,
  //       HourlyRate,
  //       Affiliation,
  //       EducationalBackground,
  //       idDocument,
  //       medicalLicenseDocument,
  //       medicalDegreeDocument
  //     });

  //     // Add the uploaded document file paths to the new doctor's data
  //     if (req.files) {
  //       newDoctor.idDocument = req.files.idDocument ? req.files.idDocument[0].path : null;
  //       newDoctor.medicalLicenseDocument = req.files.medicalLicenseDocument ? req.files.medicalLicenseDocument[0].path : null;
  //       newDoctor.medicalDegreeDocument = req.files.medicalDegreeDocument ? req.files.medicalDegreeDocument[0].path : null;
  //     }

  //     // Save the new doctor to the database
  //     try {
  //       await newDoctor.save();
  //       res.status(201).json({ message: 'Doctor registered successfully.' });
  //     } catch (error) {
  //       res.status(500).json({ error: 'Error registering doctor.' });
  //     }
  //   });
  // };



  const addHealthRecord = async (req, res) => {
    try {
      const doctorId = req.user.id; // Assuming you have the doctor's ID available in req.user

      // Extract data from the request body
      const { PatientUsername,PatientName, RecordDetails } = req.body;
      const RecordDate = new Date();

      // Find the doctor by ID
      const doctor = await doctorModel.findById(doctorId);
      const user=await userModel.findOne({Username:PatientUsername})
      if (!doctor) {
        return res.status(404).json({ error: 'Doctor not found' });
      }

      // Add the new health record to the doctor's HealthRecords array
      //doctor.HealthRecords.push({ PatientUsername, RecordDetails, RecordDate });
      user.HealthRecords.push({PatientName:PatientName,DoctorName:doctor.Name,RecordDetails:RecordDetails,RecordDate:RecordDate})
      // Save the updated doctor document
      doctor.save();
      user.save();

      res.status(201).json({ message: 'Health record added successfully.' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };


  //e
  const activateAndDeleteContract = async (req, res) => {
    try {
      // Extract doctor ID from the request params
      const { doctorId } = req.params;
  
      // Find the doctor by ID
      const doctor = await doctorModel.findById(doctorId);
  
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
  
      // Find the contract associated with the doctor
      const contract = await Contract.findOne({ DoctorId: doctor._id });
  
      if (!contract) {
        return res.status(404).json({ message: 'Contract not found' });
      }
  
      // Set the contract status to true
      contract.Status = true;
      await contract.save();
  
      // Delete the contract
      await Contract.findByIdAndDelete(contract._id);
  
      res.status(200).json({ message: 'Contract activated and deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  


  const addAvailability = async (req, res) => {
    try {
      const  doctorId  = req.user._id; // Assuming you're passing doctor's ID as a URL parameter
      const { date ,startTime, endTime} = req.body; // Assuming start and end dates of availability are passed in the request body
      const startDate = new Date(`${date}T${startTime}:00.000Z`);
      const endDate = new Date(`${date}T${endTime}:00.000Z`);


      // Validate the dates
      if (!startDate || !endDate || new Date(startDate) >= new Date(endDate)) {
        return res.send({ message: 'End time must be after start time' });
      }
  
      // Find the doctor and update availability
      const doctor = await doctorModel.findById(doctorId);
      if (!doctor) {
        return res.send({ message: 'Doctor not found' });
      }
        // Check for availability overlap
      const isOverlap = doctor.Availability.some((existingAvailability) => {
      const existingStart = new Date(existingAvailability.StartDate);
      const existingEnd = new Date(existingAvailability.EndDate);
      const newStart = new Date(startDate);
      const newEnd = new Date(endDate);

      return (
        (newStart >= existingStart && newStart < existingEnd) ||
        (newEnd > existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      );
    });
    if (isOverlap) {
      return res.send({ message: 'Overlap with existing slot' });
    }
    const isOverlapwithBooked = doctor.BookedAppointments.some((existingAppointment) => {
      const existingStart = new Date(existingAppointment.StartDate);
      const existingEnd = new Date(existingAppointment.EndDate);
      const newStart = new Date(startDate);
      const newEnd = new Date(endDate);

      return (
        (newStart >= existingStart && newStart < existingEnd) ||
        (newEnd > existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      );
    });

   
    
    if (isOverlapwithBooked) {
      return res.send({ message: 'Overlap with a booked appointment' });
    }
  
      const newAvailability = {
        _id: new mongoose.Types.ObjectId(),
        StartDate: startDate,
        EndDate: endDate
      };
  
      doctor.Availability.push(newAvailability);
      await doctor.save();
  
      res.send({ message: 'Availability added successfully', data: newAvailability });
    } catch (error) {
      res.send({ message: 'Internal Server Error' });
    }
  };

  const scheduleFollowUp= async (req,res) =>{
    const doctorId=req.user._id;
    const oldAppointment=req.body.oldAppointment;
    const patient=oldAppointment.PatientUsername;
    const patientName=oldAppointment.PatientName;
    const newAppointmentID=req.body.newAppointment;
    const doctor = await doctorModel.findById(doctorId);
    const newAppointment = doctor.Availability.find(
      (av) => {
   
         return ((av._id).toString()=== newAppointmentID)}
    );
    const user=await userModel.findOne({Username:patient});
    const newStart=newAppointment.StartDate;
    const newEnd=newAppointment.EndDate;
    const isOverlap = doctor.BookedAppointments.some((existingApp) => {
     const existingStart = new Date(existingApp.StartDate);
     const existingEnd = new Date(existingApp.EndDate);
          return (
            (newStart >= existingStart && newStart < existingEnd) ||
            (newEnd > existingStart && newEnd <= existingEnd) ||
            (newStart <= existingStart && newEnd >= existingEnd)
          );
        });
        if (isOverlap) {
          return res.send({ message: 'Overlap with existing appointment' });
        }

        const isOverlapwithUser = user.BookedAppointments.some((existingApp) => {
          const existingStart = new Date(existingApp.StartDate);
          const existingEnd = new Date(existingApp.EndDate);
               return (
                 (newStart >= existingStart && newStart < existingEnd) ||
                 (newEnd > existingStart && newEnd <= existingEnd) ||
                 (newStart <= existingStart && newEnd >= existingEnd)
               );
             });
        if (isOverlapwithUser) {
          return res.send({ message: 'Overlap with existing user appointment' });
        }
        const docApp=({
          _id:newAppointment._id,
          PatientUsername:patient,
          PatientName:patientName,
          StartDate:newAppointment.StartDate,
          EndDate:newAppointment.EndDate,
          Status:'upcoming',
       });
       doctor.BookedAppointments.push(docApp);
       const userApp=({
          _id:newAppointment._id,
          DoctorUsername:doctor.Username,
          DoctorName:doctor.Name,
          StartDate:newAppointment.StartDate,
          EndDate:newAppointment.EndDate,
          Status:'upcoming',
       }); 
        if(user.Name===patientName){  
         user.BookedAppointments.push(userApp);
        }else{
          user.FamilyBookedAppointments.push(userApp);
        }
        doctor.Availability.remove({_id:newAppointmentID});
        doctor.save();
        user.save();
        res.send("follow up booked successfully");
  }
  const viewAvailability= async (req,res) =>{
    const username = req.user.Username;
    const profile = await doctorModel.findOne({ Username: username });
    const Availability = profile.Availability;
    res.send(Availability);
  }
  
  




module.exports = {
    viewProfile,editView,editProfile,
    viewMyPatients,
    selectPatient,
    searchAppointments,viewALLAppointments,
    PostByName, viewDoctorWallet,editProfileInfo,
    viewUpcomPastAppointments,scheduleFollowUp,
   scheduleAppointment,viewContract,deleteContract,
    addHealthRecord,activateAndDeleteContract,addAvailability,viewAvailability,updateContractStatus

};
