const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const key = require("../../config/key");
const passport = require("passport");

//Load User Model
const User = require("../../models/User");

router.get("/test", (req, res) => res.json({ msg: "Users Works" }));

// @route Get api/users/register
// @desc Register user
// @access Public

router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if(user) {
      return res.status(400).json({email: '[Email already Exist]'});
    } else {
      const avatar = gravatar.url(req.body.email,{
        size: '200', //size
        r: 'pg', //Rating
        d: 'retro' //type
      })
      const newUser = new User({
        name : req.body.name,
        email : req.body.email,
        avatar,
        password : req.body.password
      });

      bcrypt.genSalt(10, (err,salt) => {
        bcrypt.hash(newUser.password,salt, (err,hash) => {
          if(err) throw err;
          newUser.password = hash;
          newUser.save().then(user => res.json(user))
          .catch(err => console.log(err));
        })
      })
    }
  });
});

// @route Get api/users/login
// @desc Login Users / Returning Token
// @access Public

router.post('/login',(req,res) => {
  const email = req.body.email;
  const password = req.body.password;

  //check user by email
  User.findOne({email}).then(user => {
    //check for user
    if(!user) {
      return res.status(404).json({email: 'User Not Found'});
    }

    //check password
    bcrypt.compare(password,user.password).then(isMatch => {
      if(isMatch) {
        //User Matched

        const payload = { id : user.id, name : user.name, avatar : user.avatar} // create JWT Payload.

        //Sign Token
        jwt.sign(payload,key.secretOrKey,{expiresIn: 3600}, (err,token) => {
          res.json({
            success : true,
            token : 'Bearer ' + token
          })
        }); // 3600 In Hours
      } else {
        return res.status(400).json({password: 'Password incorrect'})
      }
    })
  })
})

// @route Get api/users/current
// @desc Return Current User
// @access Private
router.get('/current',passport.authenticate('jwt',{session: false}), (req,res) => {
  res.json({
    id : req.user.id,
    name : req.user.name,
    avatar : req.user.avatar,
    email : req.user.email
  })
})


module.exports = router;
