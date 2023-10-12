// #Task route solution
const userModel = require('../Models/User.js');
const { default: mongoose } = require('mongoose');
const doctorModel = require('../Models/Doctor.js');// Database of doctors on the platform:accepted by admin 



const patientRegister = async (req, res) => {
   try {
      const user = new userModel({
         Username: req.body.username, 
         Name: req.body.name, 
         Email: req.body.email, 
         Password: req.body.password,
         DateOfBirth: req.body.dob,
         Gender: req.body.gender,
         MobileNumber: req.body.mobile,
         EmergencyContact_Name: req.body.emergency_name,
         EmergencyContact_MobileNumber: req.body.emergency_phone
      });
      registeredUsername = req.body.username;

      //check for duplicate username
      const userExists = await userModel.findOne({Username: req.body.username});
      if (userExists) return res.status(400).send("Username already exists");



      await user.save();
      console.log('User INSERTED!');
      res.render('patient_home.ejs',{registeredUsername});

   } catch (error) {
      console.error('Error inserting user:', error);
      res.status(500).json({ message: 'Internal server error' });
   }
}

const addFamilyMem = async (req, res) => {
   try {
      const username = req.params.registeredUsername;

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
      console.log(member)

      user.familyMembers.push(member);
      
      await user.save();
      res.json('{ success: true }')


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








  const viewALLAppointments =async(req,res)=>{
  // const username = req.params.registeredUsername;

   const profile = await userModel.findOne({ Username: "Nadatest3" });
   const BookedAppointments = profile.BookedAppointments;
   res.status(200).json(BookedAppointments);
 
 
  }
  const searchAppointments =async(req,res)=>{
   const username = req.params.registeredUsername;
   const appStatus=req.body.status;
   let BookedAppointments;
  const user = await userModel.findOne({ Username: 'Nadatest3' });
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

      res.render('selectedDoctorDetails.ejs', { doctor });

   } catch (error) {
      console.error('Error retrieving selected doctor:', error);
      res.status(500).json({ message: 'Internal server error' });
   }
};



const viewDoctors = async (req, res) => {
   try {
      const doctors = await doctorModel.find();
      const user = await userModel.findOne({Username: "omarr" });
      const updatedDoctors = doctors.map((doctor) => {
         
         if (user.healthPackage) {
            return {
               name: doctor.Username,
               price: (doctor.HourlyRate * 1.1) - user.healthPackage ,
               Speciality: doctor.Speciality
            };
         } else {
            return {
               name: doctor.Username,
               price: doctor.HourlyRate * 1.1,
               Speciality:doctor.Speciality
            };
         }
      });
      // Render the EJS template with the JSON data
      res.render('doctorResults.ejs', { doctors: updatedDoctors });
   } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching doctors');
   }
};


const viewFamilyMembers = async (req, res) => {
   try {
      const username = req.params.registeredUsername;
      //console.log(req.body.username);
      const user = await userModel.findOne({ Username:username });
      
      if (!user) {
         return res.status(404).send('User not found' );
      }else{
      const familyMembers = user.familyMembers;
      console.log(familyMembers)
      res.render('viewFamily.ejs',{familyMembers:familyMembers,registeredUsername:username})
    //  res.status(200).json({ familyMembers });
      }
   } catch (error) {
      console.error('Error retrieving family members:', error);
      res.status(500).send('Internal server error');
   }
};
const viewPrescribtion= async (req, res) => {
   try {
   //const username=req.params.registeredUsername;
    const index=req.params.index;
      const user = await userModel.findOne({ Username: 'Nadatest3'});
      //console.log(user);
      if (!user) {
         return res.status(404).send('User not found' );
      }else{
      const Prescription = user.Prescriptions[index];
      res.render('viewprescriptions.ejs',{prescription:Prescription})
      }
   } catch (error) {
      console.error('Error retrieving prescription:', error);
      res.status(500).send('Internal server error');
   }
}; 
const viewPrescriptions=async(req,res)=>{
      //const username=req.params.registeredUsername;

   const profile = await userModel.findOne({ Username: "Nadatest3" });
   const prescriptions = profile.Prescriptions;
   res.status(200).json(prescriptions);

}
 const filterPrescriptions=async(req, res)=>{
   //const username=req.params.registeredUsername;
   console.log('In filtered');
const status =req.body.prepStatus;
const date=req.body.prepDate;
const doctor=req.body.prepDr;
    const user = await userModel.findOne({ Username: 'Nadatest3' });
    let filteredPrescriptions = user.Prescriptions;
    let prescriptions;

    // Filter by doctor's username
    if (doctor !== '' && date==='' && status==='null' ) {
      prescriptions = filteredPrescriptions.filter((prescription) =>
      {
         return ( prescription.DocUsername === doctor );
      }
      
      );
    }
    if (date !== '' && doctor==='' && status=='null') {
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
    if (status !== 'null' && date==='' && doctor==='') {
      prescriptions = filteredPrescriptions.filter((prescription) =>{
         return (        prescription.Status === status
            );
      }
      );

    }
    if(doctor!=='' && date!=='' && status!=='null'){
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
    if(doctor!=='' && date!=='' && status==='null'){
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
    if(doctor!=='' && date==='' && status!=='null'){
      prescriptions = filteredPrescriptions.filter((prescription) =>{
         return (
            prescription.DocUsername === doctor &&
            prescription.Status === status ) 
      }
      );
    }
    if(doctor==='' && date!=='' && status!=='null'){
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

 


module.exports = {patientRegister,selectedDoctorDetails,addFamilyMem,searchDoctors,searchAppointments,viewALLAppointments,viewDoctors,viewFamilyMembers,viewPrescribtion,filterPrescriptions,viewPrescriptions,viewPrescribtion};
