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
});

// @route post api/posts/like/:id
// @desc Like Post
// @access Private
router.post('/like/:id',passport.authenticate('jwt',{session:false}),(req,res) => {
    Profile.findOne({user : req.user.id}).then(profile => {
        Post.findById(req.params.id).then(post => {
            if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
                return res.status(400).json({alreadylike : 'User Already like the post'});
            } else {
                post.likes.unshift({user: req.user.id});

                post.save().then(post => res.json(post));
            }
        }).catch(err => res.status(404).json({postnofound : 'Post Not Found'}));
    })
});

// @route post api/posts/unlike/:id
// @desc Unlike Post
// @access Private
router.post('/unlike/:id',passport.authenticate('jwt',{session:false}),(req,res) => {
    Profile.findOne({user : req.user.id}).then(profile => {
        Post.findById(req.params.id).then(post => {
            if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
                return res.status(400).json({notlike : 'You have not like the post'});
            } else {

                //Get remove index
                var removeIndex = post.likes.map(item => item.user.toString()).indexOf(req.user.id);

                //Splice out of array
                post.likes.splice(removeIndex,1);

                post.save().then(post => res.json(post));
            }
        }).catch(err => res.status(404).json({postnofound : 'Post Not Found'}));
    })
});

// @route post api/posts/comments/:id
// @desc Post Comments to post
// @access Private

router.post('/comment/:id',passport.authenticate('jwt',{session: false}),(req,res) => {
    const {errors,isValid} = validatePostInput(req.body);

    if(!isValid) {
        return res.status(400).json(errors);
    }

    Post.findById(req.params.id).then(post => {
        const newComment = {
            text : req.body.text,
            name : req.body.name,
            avatar : req.body.avatar,
            user : req.user.id
        }

        //Add to comment array
        post.comments.unshift(newComment);

        post.save().then(post => res.json(post));
    }).catch(err => res.status(404).json({postnofound : 'no post found'}));
});

// @route delete api/posts/comments/:id/:comment_id
// @desc Remove Comment from Post
// @access Private

router.delete('/comment/:id/:comment_id',passport.authenticate('jwt',{session: false}),(req,res) => {
    
    Post.findById(req.params.id).then(post => {
        //check if comment Exist
        if(post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
            return res.status(404).json({commentnotexist : 'comment not exist'});
        } else {
            const removeIndex = post.comments.map(item => item._id.toString()).indexOf(req.params.comment_id);

            post.comments.splice(removeIndex,1);

            post.save().then(post => res.json(post));
        }
    }).catch(err => res.status(404).json({postnofound : 'no post found'}));
})

module.exports = router;
