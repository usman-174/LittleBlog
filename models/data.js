const mongoose = require('mongoose')
const express = require("express");
const app = express();
const passport = require("passport");
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
require("../config/passport")(passport);

// Passport middleware
  app.use(passport.initialize());
  app.use(passport.session());
  
// CREATING SCHEMA 
const BlogSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,

    },
    date : {
        type : Date,
        default : Date.now,
        
 
    },
    description : {
        type : String,
        required: true
    },
    content : { 
        type : String,
        required: true
    },
    by:{
        type: String,
        required: true,
        
    }
})
module.exports = mongoose.model('data', BlogSchema)