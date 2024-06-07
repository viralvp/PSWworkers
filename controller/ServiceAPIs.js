const express= require('express');
const path=require('path');
const app = express();
const {check, validationResult} = require('express-validator');
const session = require('express-session');
const router = express.Router();
const {RegistrationUser, RegistrationEmployee, RegistrationAdmin, Service
    , Location, Language, PSW, UserServiceDetail} = require('../model/model'); 
const { v4: uuidv4 } = require('uuid');
const nodemailer = require("nodemailer");

const bodyParser = require('body-parser');
app.use(bodyParser.json());


const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, 
  auth: {
    user: "jammie.harris76@ethereal.email",
    pass: "hJYGzKxqmf3wA5T7UU",
  },
});




//render to services page
router.get('/services', async (req, res) => {

  const userName = req.session.userName;

  if (userName == null) {
      const data = getPreDefinedData(req);
      res.render('Message', {messageType: "requiredLogin", ...data});
  } else {
      const allLocation = await Location.find();
      const allLanguage = await Language.find();
      const allPsw = await PSW.find();
      const allService = await Service.find();

      const data = getPreDefinedData(req);

      res.render('Services', {
          allService: allService, allLocation: allLocation, allLanguage: allLanguage, 
          allPsw: allPsw, userName: userName, ...data
      });
  }
  
});

let storedData;
    router.post("/enrollService", async (req, res) => {
    
      const {
        userName,
        serviceType,
        location,
        psw,
        psw_id,
        availability,
        no_of_week,
        hours_per_week,
        language,
        weekly_charges,
        total_charges,
        responsibilities
      } = req.body;

      //RegistrationUser
      const userInfo = await RegistrationUser.findOne({userName: userName});
      const user_full_name = userInfo.firstName + " " + userInfo.lastName;
      const logedInUserId = req.session.logedInUserId;

      const newService = new UserServiceDetail({
        id: uuidv4(),
        userName: userName,
        user_full_name: user_full_name,
        serviceType: serviceType,
        locationName: location,
        psw: psw,
        psw_id: psw_id,
        availability: availability,
        no_of_weeks: no_of_week,
        hour_per_week: hours_per_week,
        language: language,
        weekly_charges: weekly_charges,
        total_charges: total_charges,
        responsibilities: responsibilities,
        status: "pending",
        created_by: "user",
        created_by_id: logedInUserId
      });

      await newService.save();

      // Store the relevant data from newService
      storedData = {
        status: newService.status,
        uuid: newService.id,
        psw_id: psw_id
      };

      const data = getPreDefinedData(req);
      res.redirect('/userDashBoard');
    });


    router.post('/performServiceAction', async (req, res) => {

      const {action, serviceId, pswId} = req.body;
      const logedInUserId = req.session.logedInUserId;

      const service = await UserServiceDetail.findOne({
          id: serviceId
      });

      if (service != null) {
          service.status = action;
          service.modified_by = "employee";
          service.modified_by_id = logedInUserId;
          service.modified_date = new Date();

          if (action == 'accepted') {
            service.enrollment_date = new Date();
          }
      }

      await service.save();
      const allAssignedService = await UserServiceDetail.find({psw_id: pswId});

 // Retrieve user details for email;
 const user = await RegistrationUser.findOne({ userName: service.userName });

 const info = await transporter.sendMail({
  from: '"Jammie Harris 👻" <jammie.harris76@ethereal.email>', // sender address
  to: "user@yopmail.com", // list of receivers
  subject: "PSW CONNECT INVOICE", // Subject line
  text: "Here are the invoice details:", // plain text body
  html: `
  <p style="font-weight: bold;font-size: 35px;">Dear ${user.firstName},</p>
  <p style="font-size: 25px;">Your service request has been ${action === 'accepted' ? 'accepted' : 'rejected'} by the employee.</p>
  <p style="font-weight: bold; font-size: 35px;">Service Details:</p>
  <ul>
      <li style="font-weight: bold; font-size: 25px;">Service Type: ${service.serviceType}</li>
      <li style="font-weight: bold; font-size: 25px;">Location: ${service.locationName}</li>
      <li style="font-weight: bold; font-size: 25px;">PSW Name: ${service.psw}</li>
      <li style="font-weight: bold; font-size: 25px;">Total Charges: $${service.total_charges}</li>
      <li style="font-weight: bold; font-size: 25px;">Weekly Charges: $${service.weekly_charges}</li>
  
  </ul>
  <p style="font-weight: bold;font-size: 45px;">Thank you for choosing our service.</p>
` // html body
      });

      
      res.render('EmployeeDashboard', {allAssignedService: allAssignedService});

    });



    router.post('/performServiceActionByAdmin', async (req, res) => {

      const {action, serviceId} = req.body;
      const logedInUserId = req.session.logedInUserId;

      const service = await UserServiceDetail.findOne({
          id: serviceId
      });

      if (service != null) {
          service.status = action;
          service.modified_by = "admin";
          service.modified_by_id = logedInUserId;
          service.modified_date = new Date();

          if (action == 'accepted') {
            service.enrollment_date = new Date();
          }
      }

      await service.save();

      let threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      const pendingServices = await UserServiceDetail.find({
        created_date: { $lt: threeDaysAgo },
        status: 'pending'
    });

      const serviceModifiedByAdmin = await UserServiceDetail.find({
          modified_by: 'admin'
      });

// Retrieve user details
const user = await RegistrationUser.findOne({ userName: service.userName });

      


const info = await transporter.sendMail({
  from: '"Jammie Harris 👻" <jammie.harris76@ethereal.email>', // sender address
  to: "user@yopmail.com", // list of receivers
  subject: "PSW CONNECT INVOICE", // Subject line
  text: "Here are the invoice details:", // plain text body
  html: `
  <p style="font-weight: bold;font-size: 35px;">Dear ${user.firstName},</p>
  <p style="font-size: 25px;">Your service request has been ${action === 'accepted' ? 'accepted' : 'rejected'} by the admin.</p>
  <p style="font-weight: bold; font-size: 35px;">Service Details:</p>
  <ul>
      <li style="font-weight: bold; font-size: 25px;">Service Type: ${service.serviceType}</li>
      <li style="font-weight: bold; font-size: 25px;">Location: ${service.locationName}</li>
      <li style="font-weight: bold; font-size: 25px;">PSW Name: ${service.psw}</li>
      <li style="font-weight: bold; font-size: 25px;">Total Charges: $${service.total_charges}</li>
      <li style="font-weight: bold; font-size: 25px;">Weekly Charges: $${service.weekly_charges}</li>
  
  </ul>
  <p style="font-weight: bold;font-size: 45px;">Thank you for choosing our service.</p>
` // html body
      });


      
      res.render('AdminDashboard', {
        pendingServices: pendingServices,
        serviceModifiedByAdmin: serviceModifiedByAdmin
      });

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
module.exports = router;