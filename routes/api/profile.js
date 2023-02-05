const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//load Profile & User Model
const Profile = require('../../models/Profile');
const User = require('../../models/User');

router.get("/test", (req, res) => res.json({ msg: "Profile Works" }));

// @route Get api/profile
// @desc Get Current User Profile
// @access Private
router.get("/",passport.authenticate('jwt',{session: false}),(req,res) => {
    const errors = {};
    Profile.findOne({user: req.user.id}).then(profile => {
        if(!profile) {
            errors.noprofile = "There is no profile for this user";
            return res.status(404).json(errors);
        } 
        res.json(profile);
    }).catch(err => res.status(404).json(err));
});
// @route POST api/profile
// @desc Create / edit user Profile
// @access Private
router.post("/",passport.authenticate('jwt',{session: false}),(req,res) => {
    //Get Fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if(req.body.handle) profileFields.handle = req.body.handle;
    if(req.body.company) profileFields.company = req.body.company;
    if(req.body.website) profileFields.website = req.body.website;
    if(req.body.location) profileFields.location = req.body.location;
    if(req.body.bio) profileFields.bio = req.body.bio;
    if(req.body.status) profileFields.status = req.body.status;
    if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;
    //skill - split into array
    if(typeof req.body.skills != 'undefined') {
        profileFields.skills = req.body.skills.split(',');
    }
    
    //social
    profileFields.social = {};
    if(req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if(req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if(req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if(req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({user : req.user.id}).then(profile => {
        if(profile) {
            //update
            Profile.findOneAndUpdate({user : req.user.id},{$set: profileFields},{new : true}).then(profile => res.json(profile));
        } else {
            //create

            //Check if Handle Exist
            Profile.findOne({handle: profileFields.handle}).then(profile => {
                if(profile) {
                    errors.handle = 'That Handle already Exist';
                    res.status(400).json(errors);
                }

                //save Profile
                new Profile(profileFields).save().then(profile => res.json(profile));
            });
        }
    })
})

module.exports = router;
