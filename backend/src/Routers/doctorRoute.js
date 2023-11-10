const express = require('express');
let router = express.Router();
const {  userVerification } = require('../Middleware/AuthMiddleware')

const {viewProfile,
    editView,
    editProfile,
    viewMyPatients, 
    selectPatient,
    searchAppointments,viewALLAppointments,scheduleFollowUp,
    PostByName, viewDoctorWallet,viewUpcomPastAppointments,
    scheduleAppointment,viewContract,deleteContract,editProfileInfo, 
    addHealthRecord,activateAndDeleteContract,addAvailability,viewAvailability
        } = require('../Routes/doctorController.js');


router.post('/addHealthRecord', userVerification, addHealthRecord);
// router.post('/register', registerDoctor);        
router.get('/', async(req,res) => {res.render('doc_home')});
router.get('/profile',userVerification, viewProfile);
router.get('/profile/edit/:id',editView);
router.get('/profile/edit/:id',editProfile);
router.post('/allApp',userVerification,viewALLAppointments);
router.post('/searchName',userVerification,PostByName);
router.post('/search',userVerification,searchAppointments);
router.get('/myPatients',userVerification, viewMyPatients);
router.get('/myPatients/viewPatient', selectPatient);
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


module.exports = router;