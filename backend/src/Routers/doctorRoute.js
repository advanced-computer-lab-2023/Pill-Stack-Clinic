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
    addAppointments
        } = require('../Routes/doctorController.js');

router.get('/', async(req,res) => {res.render('doc_home')})
router.get('/profile',userVerification, viewProfile)
router.get('/profile/edit/:id',editView)
router.get('/profile/edit/:id',editProfile)
router.post('/allApp',userVerification,viewALLAppointments)
router.post('/searchName',userVerification,PostByName)
router.post('/search',userVerification,searchAppointments)
router.get('/myPatients',userVerification, viewMyPatients)
router.get('/myPatients/viewPatient', selectPatient)
router.get('/viewDoctorWallet',userVerification, viewDoctorWallet)
router.get('/doctor-appointments/:username', viewUpcomPastAppointments);
router.post('/addAppointment',userVerification,addAppointments );


    



module.exports = router;