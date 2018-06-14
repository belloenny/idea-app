const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
//load user model
require('../models/Users');
const User = mongoose.model('users');

//sign in route
router.get('/signin', (req, res) => {
    res.render('signin');
});

//sign up route
router.get('/signup', (req, res) => {
    res.render('signup');
});
//login form post
router.post('/signin', (req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/ideas',
        failureRedirect:'signin',
        failureFlash: true
        
    })(req,res,next);
});
//register a user
router.post('/register', (req, res,) => {
    let errors = [];
    let success =[];
    if (req.body.password != req.body.password2) {
        errors.push({
            text: 'Passwords do not match'
        });
    }

    if (errors.length > 0) {
        res.render('signup', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        });
    } else {
        User.findOne({
                email: req.body.email
            })
            .then(user => {
                if (user) {
                    errors.push({
                        text: 'already registered'
                    });
                    res.redirect('signin')
                } else {
                    const newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password
                    });
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg','You can now sign in');
                                    res.redirect('signin')
                                })
                                .catch(err => {
                                    console.log(err);
                                    return;
                                })
                        });
                    });
                }
            });

    }
});

//signout user
router.get('/signout',(req,res)=>{
    req.logout();
    req.flash('success_msg','you have signed out');
    res.redirect('/users/signin');
});




module.exports = router;