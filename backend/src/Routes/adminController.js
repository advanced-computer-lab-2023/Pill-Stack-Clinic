const adminModel = require('../Models/Admin.js');
const docModel = require('../Models/Doc_Request.js');
const doctorModel = require('../Models/Doctor.js');
const packageModel=require('../Models/Packages.js');
const patientModel=require('../Models/User.js');
const { default: mongoose } = require('mongoose');

const viewDocApp= async (req, res) => {
    const applicationId = req.params.id;
    const application = await docModel.findById(applicationId);
    res.send(application);
}

const viewAllApp= async (req, res) => {
    const applications = await docModel.find({});
    res.send(applications);
// res.render('docApplications.ejs',{userData:applications});
}



 const viewAllPacks= async (req, res) => {
    const Pack = await packageModel.find({}).sort({createdAt:-1});
res.send(Pack);
}
const createPackage = async (req, res) => {
  console.log("Received request body:", req.body);

    const dupPack = await packageModel.findOne({Package_Name:req.body.packagename});
    const package = new packageModel({
       Package_Name: req.body.packagename, 
       Price: req.body.price, 
       Session_Discount:req.body.session_dis, 
       Pharmacy_Discount:req.body.pharmacy_dis,
       Family_Discount: req.body.family_dis,       
       });
       if(dupPack){
        return res.status(400).send("package already exist").end();
    }
    
    package.save(function(err){
       if (err) {
          throw err;
       }
       else{
        console.log('INSERTED!');
       }
       
 
   });
   const Pack = await packageModel.find({});
   res.send(Pack);
}
const viewPack=async(req,res)=>{
    const {id}=req.params
    console.log(id)
    const pack = await packageModel.findById(id);
    res.send(pack);
 }
 const viewPack2=async(req,res)=>{
    const {id}=req.params
    console.log(id)
    const pack = await packageModel.findById(id);
    res.send(pack );
 }
 const updatePack=async(req,res)=>{
    const { id } = req.params;
     
       try {
         const pack = await packageModel.findById(id);
         if (!pack) {
           return res.status(404).send('Profile not found');
         }
     
         // Update the specific fields based on form submission
         pack.Price=req.body.Price;
         pack.Session_Discount = req.body.Session_Discount;
         pack.Pharmacy_Discount = req.body.Pharmacy_Discount;
         pack.Family_Discount = req.body.Family_Discount;
         if( pack.Session_Discount <0 || pack.Session_Discount>100 ||pack.Pharmacy_Discount<0 || pack.Pharmacy_Discount>100||
            pack.Family_Discount<0 || pack.Family_Discount>100){
                return 
            }
     
         await pack.save();
     
         // Redirect back to the profile view or show a success message
         res.send('Pacakge Updated');
       } catch (error) {
         console.error(error);
         res.status(500).send('Internal Server Error');
       }
 }
 const deletePack=async(req,res)=>{
    const { id } = req.params;
     
    try {
      const pack = await packageModel.findById(id);
      if (!pack) {
        return res.status(404).send('Profile not found');
      }
  
      await pack.delete();
  
      // Redirect back to the profile view or show a success message
      res.send('Pacakge Deleted');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
}
const removeUser= async (req, res) => {
   const toBeDeleted={username:req.body.username};
   //var e = document.getElementById("userType");
   var userType =req.body.usertype ;
   console.log({username:req.body.username});
   console.log(userType);
    // Determine which model to use based on the userType
 switch (userType) {
   case 'patient':
     UserModel =patientModel;
     break;
   case 'doctor':
     UserModel = doctorModel;
     break;
   case 'admin':
     UserModel = adminModel;
     break;
   default:
     return res.status(400).send('Invalid user type');
 }
   try {
     // Find and delete the user by username
     const deletedUser = await UserModel.findOneAndDelete({Username:req.body.username });

     if (deletedUser) {
       res.send(`User '${toBeDeleted}' deleted successfully.`);
     } else {
       res.send(`User '${toBeDeleted}' not found.`);
     }
   } catch (err) {
     console.error(err);
     res.status(500).send('Internal server error');
   }

}


module.exports = {
    viewAllApp,viewDocApp,createPackage,viewAllPacks,viewPack,updatePack,
    viewPack2,deletePack,removeUser
};





