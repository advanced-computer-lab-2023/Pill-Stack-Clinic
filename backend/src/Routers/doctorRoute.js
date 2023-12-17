const express = require('express');
let router = express.Router();
const {  userVerification } = require('../Middleware/AuthMiddleware')

const {viewProfile,
    editView,
    editProfile,
    viewMyPatients, 
    selectPatient,convertToPDF,
    searchAppointments,
    viewALLAppointments,cancelAppointment,scheduleFollowUp,
    PostByName, viewDoctorWallet,viewUpcomPastAppointments,
    scheduleAppointment,viewContract,deleteContract,editProfileInfo, 
    addHealthRecord,activateAndDeleteContract,addAvailability,viewAvailability,getFullAccount
    ,updateContractStatus,addPrescription,generateRoom,join,getPatientUsername,sendMessage  , editPrescription ,joinPharmacist,getpharmacistUsername,sendMessagePharmacist,sendMessage2 
    ,handleFollowUp,getDoctorFollowUps
    ,acceptFollowUp,rejectFollowUp, rescheduleAppointment } = require('../Routes/doctorController.js');


router.post('/rescheduleAppointment',userVerification,rescheduleAppointment);
router.post('/addHealthRecord', userVerification, addHealthRecord);
// router.post('/register', registerDoctor);        
router.get('/', async(req,res) => {res.render('doc_home')});
router.get('/profile',userVerification, viewProfile);
router.get('/profile/edit/:id',editView);
router.get('/profile/edit/:id',editProfile);
router.post('/allApp',userVerification,viewALLAppointments);
router.post('/cancelAppointments',userVerification,cancelAppointment);
router.post('/searchName',userVerification,PostByName);
router.post('/search',userVerification,searchAppointments);
router.get('/myPatients',userVerification, viewMyPatients);
router.post('/myPatients/viewPatient', selectPatient);
router.post('/profile/edit/:id', editProfileInfo);
router.get('/viewDoctorWallet',userVerification, viewDoctorWallet);
router.get('/doctor-appointments/:username', viewUpcomPastAppointments);
router.post('/scheduleAppointment',userVerification, scheduleAppointment);
router.post('/scheduleFollowUp',userVerification, scheduleFollowUp); 
router.get('/contract', viewContract);
router.delete('/contract/:contractId', userVerification, deleteContract);
router.put('/:doctorId/activate-delete-contract', userVerification, activateAndDeleteContract);
router.post('/availability', userVerification, addAvailability);
router.get('/availability', userVerification, viewAvailability);
router.post('/updateContractStatus',userVerification,updateContractStatus);
router.post('/PDF/:username',userVerification,convertToPDF);
router.get('/fullPatient/:username' , userVerification, getFullAccount);
router.post('/addPrescription/:username', userVerification, addPrescription);
router.get('/getPatientUsername/:username',getPatientUsername);
router.post('/ChatDoctor/:doctorUsername/:username',join);
router.post('/sendMessage/:patientUsername/:doctorUsername',sendMessage);
router.put('/editPrescription/:username/:presId', userVerification, editPrescription);
router.get('/myUsername', viewProfile);
router.get('/getpharmacistUsername/:username',getpharmacistUsername);
router.post('/ChatDoctor2/:doctorUsername/:pharmacistUsername',joinPharmacist);
router.post('/sendMessage2/:pharmacistUsername/:doctorUsername',sendMessage2);
router.post('/followUp', userVerification, handleFollowUp);
router.get('/doctor-follow-ups', userVerification, getDoctorFollowUps);
router.post('/accept', userVerification, acceptFollowUp);
router.post('/reject', userVerification, rejectFollowUp);
module.exports = router;