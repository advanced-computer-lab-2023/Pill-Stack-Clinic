const {  Login,PatientRegister ,DoctorRegister,addAdmin, currentUser,Logout,ChangePassword,SendOTP,ResetPassword} = require('../Routes/authController')
const {  userVerification } = require('../Middleware/AuthMiddleware')

const router = require('express').Router()
router.post('/',currentUser)

router.post('/login', Login);
// router.get("/Patientregister").get( (req, res) => {
//     res.render('register')
//     })
// .post(PatientRegister);
router.post('/Patientregister',PatientRegister);

router.route('/doc_register')
  .get((req, res) => { res.render('doc_register')})
  .post(DoctorRegister);

router.route('/administration')
  .get((req,res) => {res.render('administration')})
  .post(addAdmin);

router.post('/',userVerification);
router.post('/logout',userVerification,Logout);
router.post('/changePassword',userVerification,ChangePassword);
router.post('/sendOTP',SendOTP);
router.post('/resetPassword',ResetPassword);






module.exports = router