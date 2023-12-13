const docModel = require('../Models/Doc_Request.js'); //Doctor Applications database:still waiting on approval by admin
const doctorModel = require('../Models/Doctor.js');// Database of doctors on the platform:accepted by admin 
const userModel = require('../Models/User.js');// Database of users on the platform
const Contract = require('../Models/contract.js');
const medModel = require('../Models/Medicine.js');
const { default: mongoose } = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const sendEmail = require("../Utilities/SendEmail");




 const viewProfile= async(req,res)=>{
  const username = req.user._id;
  console.log("lalal", username);
  const profile = await doctorModel.findOne({Username:username});
  console.log("profile", profile);
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
  const currDate=new Date();
  for (const app of BookedAppointments) {
    if(app.Status==='upcoming' || app.Status==='rescheduled'){

    if(app.StartDate<currDate){
     app.Status='completed';
    }
  }
  }
   profile.save();
  res.send(profile.BookedAppointments);


 }

 const cancelAppointment = async (req, res) => {
  try {
      const appointmentId = req.body.appointmentId;
      const username = req.user.Username;

      // Find the doctor
      const doctor = await doctorModel.findOne({ Username: username });

      // Find the appointment in the doctor's BookedAppointments
      const appointment = doctor.BookedAppointments.find(app => app._id.toString() === appointmentId);

      if (appointment) {
          const patientUsername = appointment.PatientUsername;

          // Find the patient
          const user = await userModel.findOne({ Username: patientUsername });

          // Check if the appointment is also in the FamilyBookedAppointments
          const familyAppointment = user.FamilyBookedAppointments.find(famAppointment => famAppointment._id.toString() === appointmentId);

          if (familyAppointment) {
              // Update status to 'cancelled' in FamilyBookedAppointments
              familyAppointment.Status = 'cancelled';
          } else {
              // Update status to 'cancelled' in BookedAppointments
              appointment.Status = 'cancelled';
              user.BookedAppointments = user.BookedAppointments.map(app => app._id.toString() === appointmentId ? { ...app, Status: 'cancelled' } : app);
          }

          // Add the appointment price to user balance
          const appointmentPrice = appointment.Price || 0;
          user.WalletBalance += appointmentPrice;
          const formattedDate = appointment.StartDate.toLocaleDateString();
          const formattedTimeStart = appointment.StartDate.toLocaleTimeString('en-US', { timeZone: 'UTC' });
          const formattedTimeEnd = appointment.EndDate.toLocaleTimeString('en-US', { timeZone: 'UTC' });
          const notification = ` Your appointment scheduled for ${formattedDate} at ${formattedTimeStart} to ${formattedTimeEnd} has been cancelled.`;
          const emailText = ` Your appointment scheduled for ${formattedDate} at ${formattedTimeStart} to ${formattedTimeEnd} has been cancelled.`;
          user.Notifications.push(notification);
          await sendEmail(user.Email, "Appointment Cancellation ",emailText );
          // Save changes to the patient
          await user.save();

          // Remove the cancelled appointment from BookedAppointments
          doctor.BookedAppointments = doctor.BookedAppointments.filter(app => app._id.toString() !== appointmentId);
          doctor.Notifications.push(notification);
          await sendEmail(doctor.Email,"New Appointment",emailText)
          // Save changes to the doctor
          await doctor.save();

          console.log('Appointment cancelled successfully');
          res.status(200).json({ message: 'Appointment cancelled successfully', refund: true });
      } else {
          console.error('Appointment not found');
          res.status(404).json({ error: 'Appointment not found' });
      }
  } catch (error) {
      console.error('Error cancelling appointment:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};


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
    console.log("oldAppointment",oldAppointment);
    const patient=oldAppointment.Username;
    const patientName=oldAppointment.Name;
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
        console.log("user",user);
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
    const currDate=new Date();
    for (const app of Availability) {
      if(app.StartDate<currDate){
       Availability.remove(app);
      }
     }
     profile.save();
    res.send(profile.Availability);
  }



  const convertToPDF=async(req,res)=>{
    const userUsername=req.params.username;
    const prescriptions=req.body.prescription;
   console.log(prescriptions);
    let i=0;
    let date=new Date(prescriptions.PrecriptionDate);
    let month=date.getMonth()+1;
    const doc = new PDFDocument;
    doc.pipe(fs.createWriteStream(prescriptions.DocUsername+userUsername+prescriptions._id+".pdf"));
    doc.fontSize(9).translate(450,0).text(date.getDate()+"-"+month+"-"+
    date.getFullYear());
    doc.fontSize(9).translate(-10,10).text("PillStack Clinic");
    doc.fontSize(20).translate(-240,60).text("Prescription",50,50);
    doc.moveDown().translate(-200,30);
 
    // Set the stroke color to black
    doc.strokeColor('black');
    
    // Set the line width
    doc.lineWidth(1);
    
    // Draw a line
    doc.moveTo(10, 50)
       .lineTo(590, 50)
       .stroke();
     doc.fontSize(18).fillColor('green').text("Doctor Name: "+prescriptions.DocUsername);
     doc.fontSize(18).fillColor('green').text("Patient Name: "+userUsername);
    for(let j=0;j<prescriptions.Medicine.length;j++){
      doc.translate(0,10);
      doc.fontSize(13).fillColor('black').text("Medicine: "+prescriptions.Medicine[j].MedicineName).translate(0,10+20*i);
      doc.fontSize(13).fillColor('black').text("Dosage: "+prescriptions.Medicine[j].Dose).translate(0,10);
      doc.fontSize(13).fillColor('black').text("Quantity: "+prescriptions.Medicine[j].Quantity).translate(0,10);
      doc.fontSize(13).fillColor('black').text("Instruction: "+prescriptions.Medicine[j].Instructions).translate(0,10+20*i);
    }
    doc.end();
    const filePath = path.join(__dirname,'../',prescriptions.DocUsername+userUsername+prescriptions._id+".pdf");
    const fileData = fs.readFileSync(filePath);
    const base64File = `data:application/pdf;base64,${fileData.toString('base64')}`;
    res.json({ file: base64File ,filename:prescriptions.DocUsername+userUsername+prescriptions._id+".pdf"});
 
 
 
 
  }
  
  
  const getFullAccount = async (req, res) => {
      try {
      const user = req.params.username;
      console.log(user);
      const patient = await userModel.findOne({ Username: user });
      const prescriptions = patient.Prescriptions;
     
      prescriptions.map((prescription) => {
        const doc = new PDFDocument;
        let i=0;
        let date=new Date(prescription.PrecriptionDate);
        let month=date.getMonth()+1;
        doc.pipe(fs.createWriteStream(prescription.DocUsername+user+prescription._id+".pdf"));
        doc.fontSize(9).translate(450,0).text(date.getDate()+"-"+month+"-"+
     date.getFullYear());
     doc.fontSize(9).translate(-10,10).text("PillStack Clinic");
     doc.fontSize(20).translate(-240,60).text("Prescription",50,50);
     doc.moveDown().translate(-200,30);
  
     // Set the stroke color to black
     doc.strokeColor('black');
     
     // Set the line width
     doc.lineWidth(1);
     
     // Draw a line
     doc.moveTo(10, 50)
        .lineTo(590, 50)
        .stroke();
      doc.fontSize(18).fillColor('green').text("Doctor Name: "+prescription.DocUsername);
      doc.fontSize(18).fillColor('green').text("Patient Name: "+user);
     for(let j=0;j<prescription.Medicine.length;j++){
       doc.translate(0,10);
       doc.fontSize(13).fillColor('black').text("Medicine: "+prescription.Medicine[j].MedicineName).translate(0,10+20*i);
       doc.fontSize(13).fillColor('black').text("Dosage: "+prescription.Medicine[j].Dose).translate(0,10);
       console.log(prescription.Medicine[j].Dose);
       doc.fontSize(13).fillColor('black').text("Quantity: "+prescription.Medicine[j].Quantity).translate(0,10);
       doc.fontSize(13).fillColor('black').text("Instruction: "+prescription.Medicine[j].Instructions).translate(0,10+20*i);
     }
     
        doc.end();});
      if (!patient) {
        return res.status(404).send({ error: 'User not found' });
      }
      res.send(patient);
    } catch (error) {
      res.status(500).send({ error: 'Internal server error' });
    }

  }

  const addPrescription = async (req, res) => {
    try {
      const doctorId = req.user.id; 
      const doctor = await doctorModel.findById(doctorId);
      const docUsername = doctor.Username;

      const patientUsername = req.params.username;
      const patient = await userModel.findOne({ Username: patientUsername });

      const { prescriptions } = req.body;
      const date = new Date();

      const meds = await Promise.all(prescriptions.map(async (prescription) => {
        const { medName, quantity, instructions, dose } = prescription;
        const med = await medModel.findOne({ Name: medName });
        if (!med) {
          res.send('med not found')
        }
        const medId = med._id;
        return { MedicineID: medId, MedicineName:medName, Quantity:quantity, Instructions:instructions, Dose: dose };
      }));



      patient.Prescriptions.push({ 
        DocUsername: docUsername, 
        PrecriptionDate: date,
        Medicine: meds, 
        Status: 'Unfilled' });

      await patient.save();
      res.send({ message: 'Prescription added successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  const editPrescription = async (req, res) => {
    try {
      const doctorId = req.user.id; 
      const doctor = await doctorModel.findById(doctorId);
      const docUsername = doctor.Username;

      const patientUsername = req.params.username;
      const patient = await userModel.findOne({ Username: patientUsername });

      const presId = req.params.presId;
      console.log("presId", presId , "patientUsername", patientUsername);


      const { prescription } = req.body;
      console.log("prescription", ...prescription);
      console.log("prescription", prescription);
      const presDate  = patient.Prescriptions.id(presId).PrecriptionDate;
      patient.Prescriptions.id(presId).remove();

      console.log("patient.Prescriptions", patient.Prescriptions);
      console.log("nanana" , prescription);
      const meds = await Promise.all(prescription[0].map(async (pre) => {
        const { MedicineName, Quantity, Instructions, Dose } = pre;
        console.log("medName", MedicineName);
        const med = await medModel.findOne({ Name: MedicineName });
        if (!med) {
          console.log("med not found");
          throw new Error('med not found');
        }
        const medId = med._id;
        console.log("medId", medId);
        console.log("medName", MedicineName);
        console.log("quantity", Quantity);
        console.log("instructions", Instructions);
        console.log("dose", Dose);
        
        return { MedicineID: medId, MedicineName:MedicineName, Quantity:Quantity, Instructions:Instructions, Dose: Dose };
      }));

      console.log("patient.Prescriptions", patient.Prescriptions[0]);
      patient.Prescriptions.push({
        DocUsername: docUsername, 
        PrecriptionDate: presDate,
        Medicine: meds, 
        Status: 'Unfilled' 
      });

      await patient.save();
      res.send({ message: 'Prescription edited successfully' });
    } catch (error) {
      res.status(400).send( 'problema' );
    }
    }




  const sendMessage = async (req, res, socket) => {
    console.log("maaaaaaaaaaaaaaaaaaaaaaaaaaaa")
    try {
      // Find the chat room based on doctorUsername
      const patientUsername = req.params.patientUsername;
      const doctorUsername = req.params.doctorUsername;
      const message = req.body.message;
      // Find the user with the specified doctor in their chatRooms
      const user = await userModel.findOne({
       'Username': patientUsername,
       'chatRooms.doctorUsername': doctorUsername
     });
      console.log(user +"ss")
      if (user) {
        // Find the specific room within the chatRooms array
        const specificRoom = user.chatRooms.find(room => room.doctorUsername === doctorUsername);
  
  
        if (specificRoom) {
          // Create the message object
          const messageData = {
            sender: doctorUsername,
            recipient: patientUsername,
            message: message,
          };

        if (specificRoom) {
          // Create the message object
          const messageData = {
            sender: doctorUsername,
            recipient: patientUsername,
            message: message,
          };
  
          // Add the message to the specific room
          specificRoom.messages.push(messageData);
          // Save changes to the user's database
          await user.save();
  
 
 
          return { room, message: messageData };
        } else {
          console.error('Chat room not found for the selected doctor');
          return null;
        }
      } else  {
        console.error('User not found for the selected doctor');
        return null;
      }
    }} catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };


  const generateRoom = () => {
    return Math.random().toString(36).substring(2, 15);
  };
  const join = async (req, res) => {
    try {
      const { doctorUsername, username } = req.params;

      const patient = await userModel.findOne({ Username: username });

      if (!patient) {

        return res.status(404).json({ message: 'doctor not found' });
      }

      // Check if the patient already has a chat room with this doctor
      const existingChatRoom = patient.chatRooms.find(
        (room) => room.doctorUsername === doctorUsername && room.username === username
      );
  
      if (existingChatRoom) {
        // If a chat room already exists, return the existing room and messages
        const { room, messages } = existingChatRoom;
        console.log("mariam")
        console.log(room)

        res.status(200).json({ room, messages });
      } else {
        // Otherwise, create a new chat room
        const room = generateRoom();
  
        // Initialize an empty array for messages
        const messages = [];
  
        // Store the room information and messages for the doctor-patient chat
        patient.chatRooms.push({
          room,
          doctorUsername,
          username,
          messages,
        });
 
        await patient.save();
   
        res.status(200).json({ room, messages });
      }
    } catch (error) {
      console.error('Error joining chat room for patient:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
 

  const getPatientUsername = async (req, res) => {
    try {
      const { username } = req.params;
      console.log(username);
      const user = await doctorModel.findOne({ Username: username });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
  
      // Ensure that user.BookedAppointments is defined and is an array
      if (!Array.isArray(user.BookedAppointments)) {
        return res.status(400).json({ message: 'Invalid user data' });
      }
  
      // Extract unique doctor usernames from completed appointments
      const patientsWithCompletedAppointments = Array.from(
        new Set(
          user.BookedAppointments
            .filter(appointment => appointment.Status === 'completed')
            .map(appointment => appointment.PatientUsername)
        )
      );
      console.log(patientsWithCompletedAppointments);
  
      res.status(200).json({ patientsWithCompletedAppointments });
    } catch (error) {
      console.error('Error retrieving doctors with completed appointments:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };


module.exports = {
    viewProfile,editView,editProfile,
    viewMyPatients,convertToPDF,
    selectPatient,
    searchAppointments,viewALLAppointments,cancelAppointment,
    PostByName, viewDoctorWallet,editProfileInfo,
    viewUpcomPastAppointments,scheduleFollowUp,
   scheduleAppointment,viewContract,deleteContract,
    addHealthRecord,activateAndDeleteContract,addAvailability,viewAvailability,updateContractStatus, getFullAccount,
    addPrescription, editPrescription, sendMessage, join, getPatientUsername,generateRoom
}
