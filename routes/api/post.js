const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//model
const Post = require('../../models/post');
const Profile = require('../../models/Profile');

//Validator
const validatePostInput = require('../../validation/post');

router.get("/test", (req, res) => res.json({ msg: "Post Works" }));

// @route GET api/posts
// @desc get Post 
// @access Public
router.get('/',(req,res) => {
    Post.find()
    .sort({date : -1})
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({nopost : "no Post Found"}));
});
// @route GET api/posts/:id
// @desc get Post by id
// @access Public
router.get('/:id',(req,res) => {
    Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => 
        res.status(400).json(err)
    );
})

// @route POST api/posts
// @desc Create Post 
// @access Private
router.post('/',passport.authenticate('jwt',{session:false}),(req,res) => {
    const {errors,isValid} = validatePostInput(req.body);

    if(!isValid) {
        return res.status(400).json(errors);
    }

    const newPost = {
        text : req.body.text,
        name : req.body.name,
        avatar : req.body.avatar,
        user : req.user.id
    };

    new Post(newPost).save().then(post => res.json(post));
})

// @route Delete api/posts/:id
// @desc Delete Post 
// @access Private
router.delete('/:id',passport.authenticate('jwt',{session:false}),(req,res) => {
    Profile.findOne({user : req.user.id}).then(profile => {
        Post.findById(req.params.id).then(post => {
            //check for post Owner
            if(post.user.toString() !== req.user.id) {
                return res.status(401).json({noauthorize : 'User not Authorize'});
            } else {
                //Delete
                post.remove().then(() => res.json({success : true}));
            }
        }).catch(err => res.status(404).json({postnofound : 'Post Not Found'}));
    })
})

module.exports = router;
