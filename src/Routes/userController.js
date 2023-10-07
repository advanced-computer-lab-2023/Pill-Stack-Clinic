// #Task route solution
const userModel = require('../Models/User.js');
const { default: mongoose } = require('mongoose');



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

      res.status(201).json({ message: 'Family Member added successfully' });
   } catch (error) {
      console.error('Error adding family member:', error);
      res.status(500).json({ message: 'Internal server error' });
   }
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


module.exports = {patientRegister,addFamilyMem, getUsers, updateUser, deleteUser};
