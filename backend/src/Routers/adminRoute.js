const express = require('express');
let router = express.Router();
const {userVerification } = require('../Middleware/AuthMiddleware')
const {viewAllApp,viewDocApp,createPackage,viewAllPacks,viewPack,updatePack,viewPack2,deletePack,removeUser,viewProfile, getAllUsers, acceptRegRequest, rejectRegRequest, acceptPlatformRequest, rejectPlatformRequest,
    pharmaApplications,getAvailableMedicines,getMedicinalUse
} = require('../Routes/adminController.js');

router.get("/", async(req,res) => {res.render('admin_home')});
router.get("/applications",viewAllApp);
router.get('/applications/view/:id',viewDocApp);
router.post('/applications/accept-registeration/:id',acceptRegRequest);
router.post('/applications/reject-registeration/:id',rejectRegRequest);
router.get('/applications/accept-Platform/:id',acceptPlatformRequest);
router.get('/applications/reject-Platform/:id',rejectPlatformRequest);
router.get('/profile',userVerification, viewProfile);
router.get("/packages",viewAllPacks)
router.get("/add_packages",(req,res)=>{res.render('add_packages')})
router.post("/packages",createPackage)
router.get('/editPack/:id',viewPack)
router.post('/editPack/:id',updatePack)
router.get('/deletePack/:id',viewPack2)
router.post('/deletePack/:id',deletePack)
router.get('/allUsers' , getAllUsers )
router.route('/removeUser')
.get((req,res) => {res.render('removeUser')})
.post(removeUser);
///Pharmacy add ons
router.get('/availableMedicines',getAvailableMedicines);
router.get('/MedicinalUse',getMedicinalUse);

// pharmacy
router.get("/pharmaApplications",pharmaApplications);


module.exports = router;


