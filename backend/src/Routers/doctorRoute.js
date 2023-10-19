const express = require('express');
let router = express.Router();
const {viewProfile,
    editView,
    editProfile,
    viewMyPatients, 
    selectPatient,
    searchAppointments,viewALLAppointments,
    SearchByName,
    PostByName
        } = require('../Routes/doctorController.js');

router.get('/', async(req,res) => {res.render('doc_home')})
router.get('/profile', viewProfile)
router.get('/profile/edit/:id',editView)
router.post('/profile/edit/:id',editProfile)
router.post('/allApp',viewALLAppointments)
router.get('/searchName',SearchByName)
router.post('/searchName',PostByName)


router.post('/search',searchAppointments)



router.route('/myPatients')
    .get( viewMyPatients)


router.get('/myPatients/viewPatient', selectPatient)


    



module.exports = router;