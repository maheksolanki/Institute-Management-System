const express = require('express');
const checkAuth = require('../middleware/checkAuth');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Fees = require('../model/Fees');
const mongoose = require('mongoose');

//1. api for adding fees
router.post('/add-fees', checkAuth,(req,res)=>{
    const token = req.headers.authorization.split(" ")[1];
    const verify = jwt.verify(token, "secretkey");

    const newFees = new Fees({
      _id : new mongoose.Types.ObjectId(),
      fullName : req.body.fullName,
      phone : req.body.phone,
      courseId : req.body.courseId, // je course ma fees add karva ma aave chhe
      uId : verify.uid,
      amount : req.body.amount,
      remark : req.body.remark
    })
    newFees.save()
    .then((result)=>{
      res.status(200).json({
        newFees :result
      })
    })
    .catch((err)=>{
      console.log(err);
      res.status(500).json({
        error: err
      })
    })
})

//2. api for getting all fees for any user
router.get("/payment-history", checkAuth,(req,res)=>{
  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, "secretkey");

  Fees.find({uId: verify.uid})
  .then((result)=>{
    res.status(200).json({
      fees : result
    })
  })
  .catch((err)=>{
    console.log(err);
    res.status(500).json({
      error: err
    })
  })  
})

//3. get all payments for any students in a course (means aek student ae ketla payments karya chhe alag alag course mate)

router.get("/all-payment",checkAuth,(req,res)=>{
  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, "secretkey");

  Fees.find({uId : verify.uid,courseId : req.query.courseId , phone : req.query.phone})
  .then((result)=>{
    res.status(200).json({
      fees: result
    })
  })
  .catch((err)=>{
    console.log(err);
    res.status(500).json({
      error: err
    })
  })
})

module.exports = router;
