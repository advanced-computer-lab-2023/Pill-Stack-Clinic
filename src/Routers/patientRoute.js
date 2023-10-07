const express = require('express');
let router = express.Router();

router.get('/', async(req,res) => {res.render('patientHome')})



module.exports = router;