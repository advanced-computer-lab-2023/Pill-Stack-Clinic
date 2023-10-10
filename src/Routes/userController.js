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
       const { name, speciality } = req.body;
       let query = {};

       console.log(name);

       if (name) {
           query["Name"] = { $regex: new RegExp(name, 'i') };
       }

       if (speciality) {
           query["Speciality"] = { $regex: new RegExp(speciality, 'i') };
       }

       // Use Mongoose to query your database based on the search criteria
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



const updateUser = async (req, res) => {
   //update a user in the database
  }

const deleteUser = async (req, res) => {
   //delete a user from the database
  }
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
else{
   if(req.body.sDate==='' && appStatus!=='null'){
   
    BookedAppointments =  user.BookedAppointments.filter((appointment) =>{
    

      return (
        appointment.Status===appStatus
      );
}
   );

}else{
   if(req.body.sDate!=='' && appStatus!=='null')
   {
    BookedAppointments =  user.BookedAppointments.filter((appointment) =>{
      // console.log(appointment.Date);
      // console.log(appDate);
      const appDate=new Date(req.body.date);
     const appEDate=new Date(req.body.eDate);


     const appointmentStartDate = new Date(appointment.StartDate);

     return (
      appointmentStartDate>=appDate && appointmentStartDate<=appEDate &&

       appointment.Status===appStatus

     );
  }
  );
}else{
    BookedAppointments = user.BookedAppointments;
   
}


}

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
      console.log(doctors);// Fetch all doctors from the database
      res.status(200).json({doctors}); // Render a view with the list of doctors
   } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching doctors');
   }
}



    

 


module.exports = {patientRegister,selectedDoctorDetails,addFamilyMem,searchDoctors, getUsers, updateUser, deleteUser,searchAppointments,viewALLAppointments,viewDoctors};
