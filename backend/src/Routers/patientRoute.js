const express = require('express');
let router = express.Router();
const {viewALLAppointments,searchDoctors,
    selectedDoctorDetails,viewAvailDoctorAppointments,
    searchAppointments,viewDoctors,viewFamilyMembers,viewPackageSubscribtion,
    viewPrescribtion,addFamilyMem,viewPrescriptions,viewAllPacks,subscribePackageCash,cancelSubscription,
    filterPrescriptions, viewPatientWallet,viewUpcomPastAppointments,payAppointmentCash,linkPatientAsFamilyMember} = require('../Routes/userController.js');
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
router.get('/viewPatientWallet',userVerification, viewPatientWallet);
router.get('/patient-appointments/:username', viewUpcomPastAppointments);
router.post('/payCash',userVerification,payAppointmentCash);
router.get("/packages",viewAllPacks);
router.post('/subscribeWallet',subscribePackageCash);
router.get('/viewMyPackage',viewPackageSubscribtion);
router.post('/cancelSubs',cancelSubscription);
router.post('/linkPatientAsFamilyMember/:Username/:emailOrPhone/:relation',userVerification,linkPatientAsFamilyMember)

module.exports = router;