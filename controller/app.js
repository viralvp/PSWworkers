const express= require('express');
const path=require('path');
const app = express();
//library to send email
const nodemailer = require('nodemailer');
const {check, validationResult} = require('express-validator');
const session = require('express-session');
const router = express.Router();
const {RegistrationUser, RegistrationEmployee, RegistrationAdmin, Service
    , Location, Language, PSW, UserServiceDetail} = require('../model/model'); 


//home page
router.get('/', async (req, res) => {
    try {
        const data = getPreDefinedData(req);
      res.render('homePage', data);
    } catch (error) {
      res.status(404).send(`Error: ${error.message}`);
    }
  });


// Registration page
router.get('/register', async (req, res) => {
    const data = getPreDefinedData(req);
    res.render('Registration', { errors: null, ...data });
    
});


router.post('/registerUser', [
    check('firstName').isAlpha().withMessage('First name must contain only alphabetic characters'),
    check('lastName').isAlpha().withMessage('Last name must contain only alphabetic characters'),
    check('userName').isAlpha().withMessage('Username must contain only alphabetic characters'),
    check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    check('age').isInt({ min: 45 }).withMessage('Age must be at least 45'),
  ], async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const data = getPreDefinedData(req);
        res.render('Registration', {errors : errors.mapped(), ...data});
        return;
      //return res.status(400).json({ errors: errors.array() });
    }
    try {

        const {
            firstName, lastName, userName, email, password, age, userType, bloodPressure,
            heartRate, medicationHistory, allergies, specialization, experience
        } = req.body;



        const newUser = new RegistrationUser({
            firstName: firstName, lastName : lastName, userName : userName, email : email, password : password, 
            age : age, userType : userType, bloodPressure : bloodPressure,
            heartRate : heartRate, medicationHistory : medicationHistory, allergies : allergies, 
            specialization : specialization, experience : experience
        });
        
        await newUser.save();

        const data = getPreDefinedData(req);
        res.render("login", data);
        
    } catch (error) {
        res.status(500).send(`Error: ${error.message}`);
    }

});

//render to about us page
router.get('/aboutUs', async (req, res) => {
    const data = getPreDefinedData(req);
    res.render('AboutUs', data);
});

//render to employee dashboard page
router.get('/dashboardEmployee', async (req, res) => {
    const data = getPreDefinedData(req);
    res.render('EmployeeDashboard', data);
});

//render to meet us page
router.get('/meetUs', async (req, res) => {

    const data = getPreDefinedData(req);
    const allEmployee = await RegistrationEmployee.find();
    res.render('MeetUs', {allEmployee: allEmployee, ...data});
});

//render to location page
router.get('/location', async (req, res) => {
    const data = getPreDefinedData(req);
    res.render('Location', data);
});

//render to contact us page
router.get('/contactUs', async (req, res) => {
    const data = getPreDefinedData(req);
    res.render('ContactUs', data);
});

//render to privacy policy page
router.get('/privacyPolicy', async (req, res) => {
    const data = getPreDefinedData(req);
    res.render('PrivacyPolicy', data);
});

router.get('/logout', async (req, res) => {
    await req.session.destroy();
    const data = getPreDefinedData(req);
    res.render('homePage', data);
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
