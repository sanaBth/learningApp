const express = require ('express');

var morgan = require('morgan');
var cors = require('cors');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
const app = express();
const userApi = require('./routes/authroutes');
const formationApi = require('./routes/formationroutes');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/formation');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
require("dotenv").config();
var cors = require('cors');
const cookieParser=require('cookie-parser');
app.use(cookieParser());
// parse application/json

app.use(cors());

app.use(bodyParser.json());

//api login et register

app.use('/apiuser',userApi);
app.use('/uploads',express.static(__dirname + '/uploads'));

app.use('/formation',formationApi);

app.listen(process.env.port || 
    4000,function(){
    console.log('now listening for requests');
  });
  