const express = require('express');
const router = express.Router();

router.post('/add-student',(req,res)=>{
  res.status(200).json({
    msg: "student added successfully",
  })
})

module.exports = router;
