const express = require('express');
let router = express.Router();
const {viewALLAppointments,searchDoctors,selectedDoctorDetails,viewAvailDoctorAppointments,searchAppointments,viewDoctors,viewFamilyMembers,viewPrescribtion,addFamilyMem,viewPrescriptions,filterPrescriptions} = require('../Routes/userController.js');
const {  userVerification } = require('../Middleware/AuthMiddleware')

// any username for now until login functionality is implemented 
let registeredUsername='Nadatest2';
router.get('/', async(req,res) => {res.render('patient_home.ejs',{registeredUsername})})
router.post("/searchDoctors",searchDoctors)
router.get('/viewDoctors',viewDoctors);
router.get('/selectedDoctorDetails/:username',selectedDoctorDetails);
router.post("/addFamMem",userVerification,addFamilyMem);
router.get('/viewFamily',userVerification,viewFamilyMembers);
router.post("/allApp",userVerification,viewALLAppointments);
router.post("/search",userVerification,searchAppointments);
router.post("/prescriptions",userVerification,viewPrescriptions);
router.get("/selectprescription/:index",userVerification,viewPrescribtion);
router.post("/searchprescriptions",userVerification,filterPrescriptions);
router.get('/viewPrescriptions',viewPrescribtion)
router.get('/viewDoctorAppointments/:username', viewAvailDoctorAppointments);




module.exports = router;