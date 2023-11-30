const express = require('express');
let router = express.Router();
const {createMedicine,searchMedicinePh,
    editMedicineResults,upload, getMedSQ, 
    filterMedicinesByMedicinalUse, getFullInfo} = require('../Routes/pharmacistController.js');
const {getAvailableMedicines} = require('../Routes/adminController.js');

router.get("/", (req,res) => {res.render('pharmacist_home')});
router.get('/availableMedicines.ejs',getAvailableMedicines);
router.put('/editmedResults',editMedicineResults);
router.get('/avMed.ejs',getMedSQ);

router.route('/createMedicine')
    .post(upload.single('image'), createMedicine);

router.route('/searchMedicine')
   .get((req,res) => { res.render('searchMedicinePh.html')})
   .post(searchMedicinePh);
   


// Handle filtering medicines by medicinal use
router.get('/filter-medicines',filterMedicinesByMedicinalUse);
router.get('/myInfo/:username' , getFullInfo )




module.exports = router;