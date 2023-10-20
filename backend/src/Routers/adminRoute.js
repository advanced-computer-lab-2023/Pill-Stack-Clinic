const express = require('express');
let router = express.Router();
const {userVerification } = require('../Middleware/AuthMiddleware')
const {viewAllApp,viewDocApp,createPackage,viewAllPacks,viewPack,updatePack,viewPack2,deletePack,removeUser} = require('../Routes/adminController.js');

router.get("/", async(req,res) => {res.render('admin_home')});
router.get("/applications",viewAllApp);
router.get('/applications/view/:id',viewDocApp);


router.get("/packages",viewAllPacks)
router.get("/add_packages",(req,res)=>{res.render('add_packages')})
router.post("/packages",createPackage)
router.get('/editPack/:id',viewPack)
router.post('/editPack/:id',updatePack)
router.get('/deletePack/:id',viewPack2)
router.post('/deletePack/:id',deletePack)

router.route('/removeUser')
.get((req,res) => {res.render('removeUser')})
.post(removeUser);

module.exports = router;


