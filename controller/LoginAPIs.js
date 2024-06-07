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


router.get('/login', (req, res) => {
  const data = getPreDefinedData(req);
    res.render('login', data);
});

router.post('/loginUser', async (req, res) => {
    const { userName, password, loginUserType } = req.body;
    if (loginUserType == 'user') {
        const registeredUser = await RegistrationUser.findOne({
          userName: userName,
          password: password,
        });

        if (registeredUser != null) {
          req.session.userType = 'user';
          req.session.userName = userName;
          req.session.logedInUserId = registeredUser.id;
          const data = getPreDefinedData(req);
          res.render("homePage", data);
        } else {
          res.render("login", { error: "Username or password is incorrect" });
        }
    } else if (loginUserType == 'admin') {
        
        const registeredUser = await RegistrationAdmin.findOne({
            userName: userName,
            password: password,
          });

          if (registeredUser != null) {
            req.session.userType = 'admin';
            req.session.userName = userName;
            req.session.logedInUserId = registeredUser.id;

            const { pendingServices, serviceModifiedByAdmin } = await fetchAdminDashboardData();
            
            

            res.render("AdminDashboard", {
                pendingServices: pendingServices,
                serviceModifiedByAdmin: serviceModifiedByAdmin
            });
          } else {
            
            res.render("login", { error: "Username or password is incorrect" });
          }
    } else if (loginUserType == 'employee') {
        
        const registeredUser = await RegistrationEmployee.findOne({
            userName: userName,
            password: password,
          });

          if (registeredUser != null) {
            req.session.userType = 'employee';
            req.session.userName = userName;
            req.session.logedInUserId = registeredUser.id;

            const allAssignedService = await UserServiceDetail.find({psw_id: registeredUser.id});

            
            res.render('EmployeeDashboard', {
                allAssignedService: allAssignedService
                
            });
          } else {
            res.render("login", { error: "Username or password is incorrect" });
          }
    }

    
});


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

module.exports = router;