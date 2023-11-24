const adminModel = require('../Models/Admin.js');
const docModel = require('../Models/Doc_Request.js');
const doctorModel = require('../Models/Doctor.js');
const packageModel=require('../Models/Packages.js');
const patientModel=require('../Models/User.js');
const pharmaReqModel = require('../Models/Pharmacist_Request.js');
const medModel = require('../Models/Medicine.js');

const { default: mongoose } = require('mongoose');

const viewDocApp= async (req, res) => {
    const applicationId = req.params.id;
    const application = await docModel.findById(applicationId);
    res.send(application);
}
const viewProfile= async(req,res)=>{
  const username = req.user.Username;
  const profile = await adminModel.findOne({Username:username});
     res.send(profile);

     console.log(profile);
 
  }

const viewAllApp= async (req, res) => {
    const applications = await docModel.find({});
    res.send(applications);
// res.render('docApplications.ejs',{userData:applications});
}

const acceptRegRequest = async (req, res) => {
  const { id } = req.params;

  try {
    const request = await docModel.findById(id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const newDoctor = new doctorModel({
      Username: request.Username,
      Name: request.Name,
      Email: request.Email,
      Password: request.Password,
      DateOfBirth: request.DateOfBirth,
      HourlyRate: request.HourlyRate,
      Affiliation: request.Affiliation,
      EducationalBackground: request.EducationalBackground,
      Speciality: request.Speciality,
      WalletBalance: 0,
      ContractStatus: false,
      Availability: request.Availability, 
      BookedAppointments: [],
      HealthRecords: [], 
    });

    await newDoctor.save();

    // Remove the accepted request from the doc_request model
    await docModel.findByIdAndRemove(id);

    res.json({ message: 'Request accepted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const rejectRegRequest = async (req, res) => {
  const { id } = req.params;

  try {
    const request = await docModel.findById(id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    await docModel.findByIdAndRemove(id);

    res.json({ message: 'Request rejected' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const acceptPlatformRequest = async (req, res) => {
  const { id } = req.params;

  try {
    const request = await docModel.findById(id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const newDoctor = new doctorModel({
      Username: request.Username,
      Name: request.Name,
      Email: request.Email,
      Password: request.Password,
      DateOfBirth: request.DateOfBirth,
      HourlyRate: request.HourlyRate,
      Affiliation: request.Affiliation,
      EducationalBackground: request.EducationalBackground,
      Speciality: request.Speciality,
      WalletBalance: 0, 
      ContractStatus: true, 
      Availability: request.Availability,
      BookedAppointments: [],
      HealthRecords: [],
    });

    await newDoctor.save();

    // Remove the accepted request from the doc_request model
    await docModel.findByIdAndRemove(id);

    res.json({ message: 'Request accepted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const rejectPlatformRequest = async (req, res) => {
  const { id } = req.params;

  try {
    const request = await docModel.findById(id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    await docModel.findByIdAndRemove(id);

    res.json({ message: 'Request rejected' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};


 const viewAllPacks= async (req, res) => {
    const Pack = await packageModel.find({}).sort({createdAt:-1});
res.send(Pack);
}
const createPackage = async (req, res) => {
  console.log("Received request body:", req.body);
 try{
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
  catch{
    res.status(400).send("Invalid inputs");
  }
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
         if (req.body.Price) 
            pack.Price=req.body.Price;
          if (req.body.Session_Discount)
            pack.Session_Discount = req.body.Session_Discount;
          if (req.body.Pharmacy_Discount)
            pack.Pharmacy_Discount = req.body.Pharmacy_Discount;
          if (req.body.Family_Discount)
            pack.Family_Discount = req.body.Family_Discount;
         await pack.save();
         const patients=await patientModel.find({'healthPackage._id':id});
         console.log(patients);
         for(let i=0;i<patients.length;i++){
          for(let j=0;j<patients[i].healthPackage.length;j++){
            if(patients[i].healthPackage[j]._id==id){
               patients[i].healthPackage[j].Price=pack.Price;
               patients[i].healthPackage[j].Session_Discount=pack.Session_Discount;
               patients[i].healthPackage[j].Pharmacy_Discount=pack.Pharmacy_Discount;
               patients[i].healthPackage[j].Family_Discount=pack.Family_Discount;
               
               await patients[i].save();
         }
         }

          
          console.log(patients);
        }
         
        
     
         // Redirect back to the profile view or show a success message
         res.send('Pacakge Updated');
       } catch (error) {
         console.error(error);
         res.status(500).send('Internal Server Error');
       }
 }
 const deletePack=async(req,res)=>{
    const { id } = req.params;
    const patients=await patientModel.find({'healthPackage._id':id});
    try {
      const pack = await packageModel.findById(id);
      if (!pack) {
        return res.status(404).send('Profile not found');
      }
      for(let i=0;i<patients.length;i++){
        for(let j=0;j<patients[i].healthPackage.length;j++){
          if(patients[i].healthPackage[j]._id==id){
            patients[i].healthPackage[j].remove();
            await patients[i].save();
          }
        }
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
  console.log( " req bod ", req.body);
   const toBeDeleted=req.body.id;
   //var e = document.getElementById("userType");
   var userType =req.body.role ;
  //  console.log({username:req.body.username});
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
   console.error('Invalid user type:', userType);
   return res.status(400).send(`Invalid user type: ${userType}`);
 }
   try {
     // Find and delete the user by username
     const deletedUser = await UserModel.findOneAndDelete({_id:toBeDeleted });

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

const getAllUsers = async (req, res) => {
  try {
    const patients = await patientModel.find({});
    const doctors = await doctorModel.find({});
    const admins = await adminModel.find();

    // Add the 'role' property to each user object
    const patientsWithRole = patients.map(patient => ({ ...patient._doc, role: 'patient' }));
    const doctorsWithRole = doctors.map(doctor => ({ ...doctor._doc, role: 'doctor' }));
    const adminsWithRole = admins.map(admin => ({ ...admin._doc, role: 'admin' }));

    // Combine all user types into a single array
    const allUsers = [...adminsWithRole, ...doctorsWithRole, ...patientsWithRole];
    // console.log(allUsers);
    res.send(allUsers);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

const pharmaApplications= async (req, res) => {
  const applications = await pharmaReqModel.find({});
  res.send(applications);
}


// Pharmacy add ons
async function getAvailableMedicines(req, res) {
  try {
    // Use Mongoose to find medicines with quantity > 0
    const availableMedicines = await medModel.find({ Quantity: { $gt: 0 } });
    res.send( availableMedicines );
  } catch (error) {
    console.error('Error fetching available medicines:', error);
    throw error;
  }
}
async function getMedicinalUse (req,res) {
  console.log('getting med use');
  const result=await  medModel.aggregate([
     { $unwind: '$MedicinalUse' }, // Unwind the array
     { $group: { _id: '$MedicinalUse' } }, // Group by MedicinalUse
   ]);
   const uniqueMedicinalUses = result.map((use) => use._id);
   console.log(uniqueMedicinalUses);
   res.send( uniqueMedicinalUses);
 

 }


module.exports = {
    viewAllApp,viewDocApp,createPackage,viewAllPacks,viewPack,updatePack,viewProfile,
    viewPack2,deletePack,removeUser, getAllUsers, acceptRegRequest, rejectRegRequest, acceptPlatformRequest, rejectPlatformRequest,
    pharmaApplications,getAvailableMedicines,getMedicinalUse
  };





