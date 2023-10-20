const {  Login,PatientRegister ,DoctorRegister,addAdmin, currentUser} = require('../Routes/authController')
const {  userVerification } = require('../Middleware/AuthMiddleware')

const router = require('express').Router()
router.post('/',currentUser)

router.post('/login', Login);
router.get("/Patientregister").get( (req, res) => {
    res.render('register')
    })
.post(PatientRegister);

router.route('/doc_register')
  .get((req, res) => { res.render('doc_register')})
  .post(DoctorRegister);

router.route('/administration')
  .get((req,res) => {res.render('administration')})
  .post(addAdmin);

router.post('/',userVerification);


module.exports = router