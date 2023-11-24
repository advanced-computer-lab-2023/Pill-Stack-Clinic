const {  Login,PatientRegister ,upload,DoctorRegister,addAdmin, currentUser,Logout,ChangePassword,SendOTP,ResetPassword,ResetPass,CheckOTP,pharmaRegister} = require('../Routes/authController')
const {  userVerification } = require('../Middleware/AuthMiddleware')

const router = require('express').Router()
router.post('/',currentUser)

router.post('/login', Login);
// router.get("/Patientregister").get( (req, res) => {
//     res.render('register')
//     })
// .post(PatientRegister);
router.post('/Patientregister',PatientRegister);

// router.route('/doc_register')
//   .get((req, res) => { res.render('doc_register')})
//   .post(DoctorRegister);



router.route('/doc_register')
  .post(upload.fields([
    { name: 'idDocument', maxCount: 1 },
    { name: 'medicalLicenseDocument', maxCount: 1 },
    { name: 'medicalDegreeDocument', maxCount: 1 },
  ]), DoctorRegister);
  
router.route('/pharma_register')
.post(upload.fields([
  { name: 'IDDocument', maxCount: 1 },
  { name: 'pharmacyDegreeDocument', maxCount: 1 },
  { name: 'workingLicenseDocument', maxCount: 1 },
]), pharmaRegister);


router.route('/administration')
  .get((req,res) => {res.render('administration')})
  .post(addAdmin);

router.post('/',userVerification);
router.post('/logout',userVerification,Logout);
router.post('/changePassword',userVerification,ChangePassword);
router.post('/sendOTP',SendOTP);
router.post('/resetPassword',ResetPassword);
router.post('/resetPass',ResetPass);
router.post('/checkOTP',CheckOTP);






module.exports = router
