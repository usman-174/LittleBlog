const express = require('express')
const app = express()
const router = express.Router()
const os = require('os')
const mongoose = require('mongoose')
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
// Requiring Data SchemaModel

const Data = require('../models/data')

// ===========  LAYING ROUTES ==============

// ____ HOME ROUTES ____ 
router.get('/', ensureAuthenticated,async (req, res) => {


    const cursor = Data.find({});
    var count = await cursor.countDocuments();
    
   try{
    Data.find((err, result) => { 
        if (!err) { 
            res.render('data/home', {
                title: 'Blogs',
                result: result,
                count: count,
                user: req.user,

            })
        } else {
            
        }
    })
   }catch{
       console.log('err')
   }
    
})


// ____ Add blog  ROUTES ____ 

router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('data/add', { title: 'ADD DATA', })
})
// ____ add blog post  ROUTES ____ 

router.post('/add', (req, res) => {

    const data = new Data({
        title: req.body.title,
        description: req.body.description,
        content: req.body.content,
        by : req.user.name

    })
    data.save((err, res) => {
        if (!err) {
            
            console.log("DATA SAVED")
        } else {
            
            console.log(err)
        }
    })
    res.redirect('/data')
})
// ____ selected blog  ROUTES ____ 

router.get('/show/:_id', ensureAuthenticated, async (req, res) => {
    const blogid = await Data.findById(req.params._id)
    try{
   res.render("data/show", {
     title: blogid.title,
     result: blogid, 
     user: req.user,
   });
    }catch(e){
        console.log(e)
        res.redirect('/data')
    }
 


})

//  ____ Delete selected blog  ROUTES ____ 

router.post('/delete/:_id',async (req, res) => {
    try{
 Data.findByIdAndDelete(req.params._id, (err, result) => {
   if (!err) {
     res.redirect("/data");
   } else {
     res.json(err);
   }
 });
    }catch(e){
        console.log(e)
    }
   

})
//  ____ Edit selected blog  ROUTES ____ 
router.get('/edit/:_id', async (req, res) => {
    const blog = await Data.findById(req.params._id)
    res.render('data/edit', {
        result: blog,
        title: `${blog.title}/Edit`
    })
})

    router.post('/edit/:_id',  (req, res, next) => {
        
        Req = Data.findById(req.params._id)
        next()

    },edit('edit'))



    function edit(path) {

        return async (req, res) => {
            data = Req 
            data.title = req.body.title
            data.description = req.body.description
            data.content = req.body.content

            try {
                data = await data.save((err, result) => {
                    if (!err)
                        res.redirect('/data')

                    else {
                        res.json(err);
                    }
                })

            } catch (err) {
                
                res.render(`${path}`, { result: Data })

            }
        }
    }
// ===========  LAYING ROUTES END HERE ==============

// EXPORTING ROUTER MODEL

module.exports = router