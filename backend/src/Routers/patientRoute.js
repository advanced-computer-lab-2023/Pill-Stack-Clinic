const express = require('express');
const multer = require('multer');
let router = express.Router();
const {viewALLAppointments,searchDoctors,
    selectedDoctorDetails,viewAvailDoctorAppointments,
    searchAppointments,viewDoctors,viewFamilyMembers,viewPackageSubscribtion,
    viewPrescribtion,addFamilyMem,viewPrescriptions,viewAllPacks,subscribePackageCash,cancelSubscription,
    filterPrescriptions, viewPatientWallet,viewUpcomPastAppointments,payAppointmentWallet,linkPatientAsFamilyMember,uploadMedicalDocument,
    removeMedicalDocument,getAmount,viewAllAvailableAppointments,viewFamilyAppointments,viewMyHealthRecords} = require('../Routes/userController.js');
const {  userVerification } = require('../Middleware/AuthMiddleware')


// Create a storage engine for multer to handle file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/medical-history/'); // Define the destination folder
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + '-' + uniqueSuffix);
    },
  });
  
  const upload = multer({ storage });


// any username for now until login functionality is implemented 
let registeredUsername='Nadatest2';
// Route for uploading a medical history document
router.post( '/upload-document', userVerification, upload.single('document'), uploadMedicalDocument );
// Route for removing a medical history document
router.delete('/remove-document/:documentId', userVerification, removeMedicalDocument);
router.get('/', async(req,res) => {res.render('patient_home.ejs',{registeredUsername})})
router.post("/searchDoctors",searchDoctors)
router.post('/getAmount',userVerification,getAmount);
router.get("/bookAppointments",userVerification,viewAllAvailableAppointments);
router.get('/viewDoctors',userVerification,viewDoctors);
router.get('/selectedDoctorDetails/:username',selectedDoctorDetails);
router.post("/addFamMem",userVerification,addFamilyMem);
router.get('/viewFamily',userVerification,viewFamilyMembers);
router.get('/viewFamilyAppointments',userVerification,viewFamilyAppointments);
router.post("/allApp",userVerification,viewALLAppointments);
router.post("/search",userVerification,searchAppointments);
router.post("/prescriptions",userVerification,viewPrescriptions);
router.get("/selectprescription/:index",userVerification,viewPrescribtion);
router.post("/searchprescriptions",userVerification,filterPrescriptions);
router.get('/viewPrescriptions',viewPrescribtion)
router.get('/viewDoctorAppointments/:username', viewAvailDoctorAppointments);
router.get('/viewPatientWallet',userVerification, viewPatientWallet);
router.get('/patient-appointments/:username', viewUpcomPastAppointments);
router.post('/payWallet',userVerification,payAppointmentWallet);
router.get("/packages",viewAllPacks);
router.post('/subscribeWallet',subscribePackageCash);
router.get('/viewMyPackage',viewPackageSubscribtion);
router.post('/cancelSubs',cancelSubscription);
router.post('/linkPatientAsFamilyMember/:Username/:emailOrPhone/:relation',userVerification,linkPatientAsFamilyMember)
router.get('/viewMyHealthRecords/:Username',userVerification,viewMyHealthRecords)

module.exports = router;