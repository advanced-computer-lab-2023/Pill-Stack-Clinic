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
module.exports = {
    viewAllApp,viewDocApp,
};
