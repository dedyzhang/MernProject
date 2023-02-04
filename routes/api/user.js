const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");

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

module.exports = router;
