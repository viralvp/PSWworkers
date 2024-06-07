const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

//User registration schema
const userRegistrationSchema= new mongoose.Schema({
  id: Number,
  firstName: String,
  lastName: String,
  email: String,
  userName: String,
  password: String,
  dob: Date,
  age: Number,
  bloodGroup: String,
});
const RegistrationUser = mongoose.model('RegistrationUser',userRegistrationSchema);

 //Employee registration schema
const employeeRegistrationSchema= new mongoose.Schema({
  id: Number,
  firstName: String,
  lastName: String,
  name: String,
  userName: String,
  password: String,
  age: Number,
  specialization: String,
  experience: Number,
  availability: String,
  ratings: String,
  img: String,
  hourly_wage: Number
});
const RegistrationEmployee = mongoose.model('RegistrationEmployee',employeeRegistrationSchema);


// //Admin schema
const adminSchema=new mongoose.Schema({
    id: Number,
    firstName: String,
    lastName: String,
    email: String,
    userName: String,
    password: String
  });
  const RegistrationAdmin = mongoose.model('RegistrationAdmin', adminSchema); 


// //Service Master
const serviceSchema = new mongoose.Schema({
  id: Number,
  serviceName: String
});
const Service = mongoose.model('Service', serviceSchema); 

// //Location Master
const locationSchema = new mongoose.Schema({
  id: Number,
  locationName: String
});
const Location = mongoose.model('Location', locationSchema); 

// //PSW Master
const pswSchema = new mongoose.Schema({
  id: Number,
  name: String,
  experience: Number,
  hourly_wage: Number
});
const PSW = mongoose.model('PSW', pswSchema); 

// //Language Master
const languageSchema = new mongoose.Schema({
  id: Number,
  name: String
});
const Language = mongoose.model('Language', languageSchema); 


// //UserServiceDetail
const userServiceDetailSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  userName: String,
  user_full_name: String,
  email: String,
  serviceType: String,
  locationName: String,
  psw: String,
  psw_id: Number,
  availability: String, //morning, afternoon, evening, over night
  no_of_weeks: Number,
  hour_per_week: Number,
  language: String,
  weekly_charges: Number,
  total_charges: Number,
  responsibilities: String,
  enrollment_date: { 
    type: Date
  },
  status: String,
  created_by: String,
  created_by_id: Number,
  created_date: { 
    type: Date, 
    default: Date.now
  },
  modified_by: String,
  modified_by_id: Number,
  modified_date: { 
    type: Date
  }
});
const UserServiceDetail = mongoose.model('UserServiceDetail', userServiceDetailSchema); 


module.exports= {RegistrationUser, RegistrationEmployee, RegistrationAdmin, Service
, Location, Language, PSW, UserServiceDetail};