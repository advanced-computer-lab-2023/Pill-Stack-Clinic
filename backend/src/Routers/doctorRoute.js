const express = require('express');
let router = express.Router();
const {  userVerification } = require('../Middleware/AuthMiddleware')

const {viewProfile,
    editView,
    editProfile,
    viewMyPatients, 
    selectPatient,
    searchAppointments,viewALLAppointments,
    PostByName, viewDoctorWallet,viewUpcomPastAppointments,
    addAppointments,scheduleAppointment,viewContract,deleteContract, registerDoctor, addHealthRecord,activateAndDeleteContract,addAvailability
        } = require('../Routes/doctorController.js');


router.post('/addHealthRecord', userVerification, addHealthRecord);
router.post('/register', registerDoctor);        
router.get('/', async(req,res) => {res.render('doc_home')});
router.get('/profile',userVerification, viewProfile);
router.get('/profile/edit/:id',editView);
router.get('/profile/edit/:id',editProfile);
router.post('/allApp',userVerification,viewALLAppointments);
router.post('/searchName',userVerification,PostByName);
router.post('/search',userVerification,searchAppointments);
router.get('/myPatients',userVerification, viewMyPatients);
router.get('/myPatients/viewPatient', selectPatient);
router.get('/viewDoctorWallet',userVerification, viewDoctorWallet);
router.get('/doctor-appointments/:username', viewUpcomPastAppointments);
router.post('/addAppointment',userVerification,addAppointments );
router.post('/:doctorId/scheduleAppointment', scheduleAppointment); 
router.get('/contract', viewContract);
router.delete('/contract/:contractId', userVerification, deleteContract);
router.put('/doctor/:doctorId/activate-delete-contract', userVerification, activateAndDeleteContract);
router.post('/doctor/:doctorId/availability', userVerification, addAvailability);

module.exports = router;