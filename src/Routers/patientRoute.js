const express = require('express');
let router = express.Router();
const {viewALLAppointments,searchAppointments,viewDoctors,viewFamilyMembers,viewPrescribtion} = require('../Routes/userController.js');

// any username for now until login functionality is implemented 
let registeredUsername='Nadatest2';
router.get('/', async(req,res) => {res.render('patient_home.ejs',{registeredUsername})})
//until login functionality is implemented shifted to app.js
// router.post("/search/:registeredUsername",searchAppointments);
// router.post("/allApp/:registeredUsername",viewALLAppointments);
router.route('/viewDoctors')
   .get((req,res) => { res.render('doctorResults.ejs')})
   .post(viewDoctors);
   router.get('/viewFamily',viewFamilyMembers)
   router.get('/viewPrescriptions',viewPrescribtion)



module.exports = router;