const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {
    ensureAuthenticated
} = require('../helpers/auth');

//load ideas model
require('../models/Ideas');
const idea = mongoose.model('ideas');


//ideas index page
router.get('/', ensureAuthenticated, (req, res) => {
    idea.find({
            user: req.user.id
        })
        .sort({
            date: 'desc'
        })
        .then(ideas => {
            res.render('ideas/index', {
                ideas: ideas
            });
        }).catch(err => console.log(err));
});

//signin route from ideas page
router.get('/users/signin', (req, res) => {
    res.render('signin');
});

//idea route
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    idea.findOne({
            _id: req.params.id
        })
        .then(idea => {
            res.render('ideas/edit', {
                idea: idea
            });
        })
});


//Edit route
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('ideas/add');
});


//Process form
router.post('/', ensureAuthenticated, (req, res) => {
    let errors = [];
    if (!req.body.title) {
        errors.push({
            text: 'Please add a title'
        });
    }
    if (!req.body.details) {
        errors.push({
            text: 'please add some details'
        });
    }
    if (errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details,
            user: req.user.id
        }
        new idea(newUser)
            .save()
            .then(idea => {
               req.flash('success_msg','Idea added');
                res.redirect('/ideas');
            });
    }
});


//Edit form process
router.put('/:id', ensureAuthenticated, (req, res) => {
    idea.findOne({
            _id: req.params.id
        })
        .then(idea => {
            //new values
            idea.title = req.body.title;
            idea.details = req.body.details;
            idea.save()
                .then(idea => {
                    req.flash('success_msg', 'successfully edited');
                    res.redirect('/ideas');
                });
        });
});


//delete ideas
router.delete('/:id', ensureAuthenticated, (req, res) => {
    idea.remove({
            _id: req.params.id
        })
        .then(() => {
            req.flash('success_msg', 'idea removed');
            res.redirect('/ideas');
        });
});

module.exports = router;