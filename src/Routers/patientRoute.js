const express = require('express');
let router = express.Router();
const {viewALLAppointments,searchAppointments,viewDoctors,viewFamilyMembers,viewPrescribtion,viewPrescriptions,filterPrescriptions,selectedDoctorDetails,searchDoctors,addFamilyMem} = require('../Routes/userController.js');

// any username for now until login functionality is implemented 
//let registeredUsername='Nadatest2';
router.get('/:registredUsername', async(req,res) => {res.render('patient_home.ejs',{registeredUsername:req.params})})
//until login functionality is implemented shifted to app.js
router.post("/addFamMem/:registeredUsername",addFamilyMem);
router.get('/viewFamily/:registeredUsername',viewFamilyMembers)
router.post("/search/:registeredUsername",searchAppointments);
router.post("/allApp/:registeredUsername",viewALLAppointments);
router.post("/prescriptions/:registeredUsername",viewPrescriptions);
router.post("/searchprescriptions/:registeredUsername",filterPrescriptions);
router.get("/selectprescription/:registeredUsername/:index",viewPrescribtion);

router.get('/selectedDoctorDetails/:username',selectedDoctorDetails);

router.post("/searchDoctors",searchDoctors)


   
   router
   .route('/viewDoctors')
     .get((req,res) => { res.render('viewDoctors')})
     .post(viewDoctors);


module.exports = router;