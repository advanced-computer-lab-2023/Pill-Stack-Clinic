const express = require('express');
const multer = require('multer');
const upload = require('../multerConfig'); 
let router = express.Router();
const {viewALLAppointments,searchDoctors,
    selectedDoctorDetails,viewAvailDoctorAppointments,checkSubscribed,
    searchAppointments,viewDoctors,viewFamilyMembers,viewPackageSubscribtion,
    viewPrescribtion,addFamilyMem,viewPrescriptions,viewAllPacks,subscribePackageCash,cancelSubscription,cancelAppointment,cancelFamAppointment,viewProfile,
    filterPrescriptions, viewPatientWallet,viewUpcomPastAppointments,payAppointmentWallet,linkPatientAsFamilyMember,uploadMedicalDocument,
    removeMedicalDocument,getAmount,viewAllAvailableAppointments,
    viewFamilyAppointments,viewMyHealthRecords,getAddresses,convertToPDF,
    orderDetails,addDeliveryAddress,requestFollowUp,requestFollowUp2,generateRoom,joinChatRoomPatient,getDoctorUsername,sendMessage, rescheduleAppointment, famRescheduleAppointment,viewAvailDoctorAppointmentsforReschedule} = require('../Routes/userController.js');
const {  userVerification } = require('../Middleware/AuthMiddleware')




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
router.get('/profile',userVerification, viewProfile)
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
router.post('/cancelAppointments',userVerification,cancelAppointment);
router.post('/cancelFamAppointments',userVerification,cancelFamAppointment);
router.post('/linkPatientAsFamilyMember/:Username/:emailOrPhone/:relation',userVerification,linkPatientAsFamilyMember)
router.get('/viewMyHealthRecords/:Username/:Patientname',userVerification,viewMyHealthRecords)
router.post('/checkSubscribed',checkSubscribed);
router.post('/PDF',userVerification,convertToPDF);
router.post('/request-follow-upp',userVerification ,requestFollowUp);
router.post('/request-follow-upp2',userVerification ,requestFollowUp2);
router.get('/getDoctorUsername/:username',getDoctorUsername);
router.post('/Chat/:username/:doctorUsername',joinChatRoomPatient)
router.post('/sendMessage/:patientUsername/:selectedDoctor',sendMessage)
router.post('/rescheduleAppointment',userVerification,rescheduleAppointment);
router.post('/famRescheduleAppointment',userVerification,famRescheduleAppointment);
////Pharmacy add ons 
router.get('/Address',userVerification,getAddresses)
router.get('/orderDetails',userVerification,orderDetails)
router.post('/addDeliveryAddress/:username',addDeliveryAddress)
router.post('/getFreeAppointments',viewAvailDoctorAppointmentsforReschedule)
module.exports = router;