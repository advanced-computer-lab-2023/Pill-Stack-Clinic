const express = require('express');
let router = express.Router();
const {viewProfile,editView,editProfile} = require('../Routes/doctorController.js');

router.get('/', async(req,res) => {res.render('doc_home')})
router.get('/profile', viewProfile)
router.get('/profile/edit/:id',editView)
router.post('/profile/edit/:id',editProfile)



module.exports = router;