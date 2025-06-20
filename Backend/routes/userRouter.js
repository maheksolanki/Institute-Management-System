const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
require("dotenv").config();
// Configure Cloudinary with environment variables
const User = require("../model/User");
const { default: mongoose } = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// # this is for signup route
router.post("/signup", (req, res) => {
  //----->>>> 0. check if the user already exists with the same email
  User.find({ email: req.body.email }).then((users) => {
    if (users.length > 0) {
      return res.status(500).json({
        error: "User already exists with this email",
      });
    }
    //----->>>> 1. this is for image upload to cloudinary
    cloudinary.uploader.upload(req.files.image.tempFilePath, (err, result) => {
      // console.log(result);
      //----->>>> 2. conver the password in hashcode
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({
            error: err,
          });
        }
        //----->>>> 3. create a new user with the data from the request body and the image url and id from cloudinary

        const newUser = new User({
          _id: new mongoose.Types.ObjectId(), // this is used to create a new unique id for the user
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: hash, // this is the hashed password
          imageUrl: result.secure_url, // this is the url of the image uploaded to cloudinary
          imageId: result.public_id, // this is the id of the image uploaded to cloudinary
        });
        newUser
          .save()
          .then((result) => {
            console.log(result);
            res.status(200).json({
              newStudent: result,
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              error: err.message,
            });
          });
      });
    });
  });
});

// # this is for login route
router.post("/login", (req, res) => {
  User.find({ email: req.body.email }).then((users) => {
    // here users is an array of users and it is only one user because email is unique
    if (users.length === 0) {
      return res.status(500).json({
        msg: "email not registered",
      });
    }
    bcrypt.compare(req.body.password, users[0].password, (err, result) => {
      if (!result) {
        return res.status(500).json({
          msg: "password is incorrect",
        });
      }
      // if password is correct then we create a token for the user
      const token = jwt.sign(
        {
          email: users[0].email,
          firstName: users[0].firstName,
          lastName: users[0].lastName,
          uid: users[0]._id,
        },
        "secretkey", // this is the secret key used to sign the token, it should be kept secret
        {
          expiresIn: "365d", // this is the expiration time of the token, after which the token will be invalid
        }
      );
      res.status(200).json({
        _id: users[0]._id,
        firstName: users[0].firstName,
        lastName: users[0].lastName,
        email: users[0].email,
        imageUrl: users[0].imageUrl,
        imageId: users[0].imageId,
        token: token, // this is the token that will be used to authenticate the user in future requests
      });
    });
  });
});

module.exports = router;
