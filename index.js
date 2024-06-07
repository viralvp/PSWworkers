const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/PSW_1')
  .then(() => console.log('MongoDB connected')  )
  .catch(err => console.error('MongoDB connection error:', err));

// Set up middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(fileUpload());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Set up session middleware
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

// Include your router
const pageRouter = require('./controller/app');
const serviceApiRouter = require('./controller/ServiceAPIs');
const loginApiRouter = require('./controller/LoginAPIs');
const dashboardApiRouter = require('./controller/DashboardAPIs');

app.use('/', pageRouter);
app.use('/', serviceApiRouter);
app.use('/', loginApiRouter);
app.use('/', dashboardApiRouter);


// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000/');
});










