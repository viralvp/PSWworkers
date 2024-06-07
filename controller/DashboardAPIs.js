const express= require('express');
const path=require('path');
const app = express();
const {check, validationResult} = require('express-validator');
const session = require('express-session');
const router = express.Router();
const {RegistrationUser, RegistrationEmployee, RegistrationAdmin, Service
    , Location, Language, PSW, UserServiceDetail} = require('../model/model'); 

const bodyParser = require('body-parser');
app.use(bodyParser.json());



//render to user dashboard page
router.get('/userDashBoard', async (req, res) => {

    

    const userName = req.session.userName;

    if (userName == null) {
        res.render('Message', {messageType: "requiredLogin"});
    } else {
        const userInfo = await RegistrationUser.findOne({userName: userName});
        const fullName = userInfo.firstName + " " + userInfo.lastName;
        const allUserServices = await UserServiceDetail.find({userName: userName});
        const data = getPreDefinedData(req);
        res.render('UserDashboard', {allUserServices: allUserServices, fullName: fullName, ...data});
    }
    
});

//render to employee dashboard
router.get('/employeeDashBoard', async (req, res) => {

    const psw_id = req.session.logedInUserId;
    const allAssignedService = await UserServiceDetail.find({psw_id: psw_id});
    const data = getPreDefinedData(req);

    res.render('EmployeeDashboard', {allAssignedService: allAssignedService, ...data});
});

//render to admin dashboard
router.get('/adminDashBoard', async (req, res) => {
    
    const { pendingServices, serviceModifiedByAdmin } = await fetchAdminDashboardData();
    const data = getPreDefinedData(req);
    res.render("AdminDashboard", {
        pendingServices: pendingServices,
        serviceModifiedByAdmin: serviceModifiedByAdmin,
        ...data
    });
});

async function fetchAdminDashboardData() {
    let threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    // Use this date in your query for pending services
    const pendingServices = await UserServiceDetail.find({
        created_date: { $lt: threeDaysAgo },
        status: 'pending'
    });

    // Find services modified by admin
    const serviceModifiedByAdmin = await UserServiceDetail.find({
        modified_by: 'admin'
    });

    return { pendingServices, serviceModifiedByAdmin };
}

function getPreDefinedData(req) {
  
    if (req.session) {
        
        let userName = req.session.userName;
        if (userName != null) {
            return {isLogedIn:true}
        } else {
            return {isLogedIn:false}
        }
    } else {
        
        return {isLogedIn:false}
    }
    
  }
module.exports = router;