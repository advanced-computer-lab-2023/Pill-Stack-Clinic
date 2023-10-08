const express = require('express');
let router = express.Router();
const {viewALLAppointments,searchAppointments} = require('../Routes/userController.js');

// any username for now until login functionality is implemented 
let registeredUsername='Nadatest2';
router.get('/', async(req,res) => {res.render('patient_home.ejs',{registeredUsername})})
//until login functionality is implemented shifted to app.js
// router.post("/search/:registeredUsername",searchAppointments);
// router.post("/allApp/:registeredUsername",viewALLAppointments);






module.exports = router;