const adminModel = require('../Models/Admin.js');
const docModel = require('../Models/Doc_Request.js');

const { default: mongoose } = require('mongoose');
const viewDocApp= async (req, res) => {
    const applicationId = req.params.id;
    const application = await docModel.findById(applicationId);
    res.render('singleApplication.ejs', { application });
}

const viewAllApp= async (req, res) => {
    const applications = await docModel.find({});
res.render('docApplications.ejs',{userData:applications});
}

const addAdmin = async(req,res) => {
    // username, password
    const admin = new adminModel({
       username: req.body.username, 
       password:req.body.password,
       });
 
       console.log(req.body.username);
    admin.save(function(err){
       if (err) {
          throw err;
       }
       console.log('Added!');
   });
   res.status(200).send("Admin added successfuly.")
 }


module.exports = {
    viewAllApp,viewDocApp,addAdmin
};





