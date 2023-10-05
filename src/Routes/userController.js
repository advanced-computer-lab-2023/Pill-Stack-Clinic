// #Task route solution
const userModel = require('../Models/User.js');
const { default: mongoose } = require('mongoose');



const patientRegister = async(req,res) => {
   console.log(req.body.name);
   // username, name, email, password, date of birth, gender, mobile number, emergency contact (full name, mobile number)
   const user = new userModel({
      Username: req.body.username, 
      Name: req.body.name, 
      Email:req.body.email, 
      Password:req.body.password,
      DateOfBirth: req.body.dob,
      Gender: req.body.gender,
      MobileNumber: req.body.mobile,
      EmergencyContact_Name: req.body.emergency_name,
      EmergencyContact_MobileNumber: req.body.emergency_phone
      });

      
   user.save(function(err){
      if (err) {
         throw err;
      }
      console.log('INSERTED!');

  });
   res.render('patient_home');

}


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


module.exports = {patientRegister, getUsers, updateUser, deleteUser};
