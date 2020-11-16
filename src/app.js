if(process.env.NODE_ENV !== 'production'){
require("dotenv").config();
}

const express = require('express')
const app = express()
const ejs = require('ejs')
const path = require('path')
const flash = require('connect-flash');
const session = require('cookie-session')
const mongoose = require('mongoose')
// const url = process.env.DATABASE_URL || 'mongodb://localhost:27017/LittleBlog';
const port = process.env.PORT || 8000
const passport = require('passport')
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');


// passport
require('../config/passport')(passport)
// DATA MODEL
const Data = require('../models/data')
// CONNECTING TO MONGO ATLAS

mongoose
  .connect(process.env.DATABASE_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
  })
  const db = mongoose.connection
  db.on('error', error => console.error(error))
db.once("open", () => console.log('Connected.'));


// REQUIRING CONTROLLERS

const dataController = require('../Controllers/dataController')
const UserController = require('../Controllers/userontroller')

// SETTING MIDDLEWARES
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
// Express session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );
  
  // Passport middleware
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Connect flash
  app.use(flash());
  
  // Global variables
  app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });
// EJS SETUP
const public = path.join(__dirname, '../public')
app.use(express.static(public))

const templates = path.join(__dirname, '../templates/views')
app.set('view engine', "ejs")
app.set('views', templates)
app.get('/', forwardAuthenticated, async (req, res)=> {
    
    if (req.user) {
       res.redirect('/data')
    } else {
        const cursor = Data.find({});
        var count = await cursor.countDocuments();
        
       try{
        Data.find((err, result) => { 
            if (!err) { 
                res.render('welcome', {
                    title: 'Blog',
                    result: result,
                    count: count,
                    user: req.user,
                    
    
                })
            } else {
                
            }
        })
       }catch(e){
           console.log(e)
       }
    }
})

app.use('/data', dataController)
app.use('/users', UserController)

app.get('*',(req,res)=>{
    res.render('error',{title: 'Page Not Found'})
   
})
app.listen(port, (req, res) => {
  console.log("");
});