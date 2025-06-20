const express = require('express');
const router = express.Router();

router.post('/add-fees',(req,res)=>{
  res.status(200).json({
    msg: "fees added successfully",
  })
})

module.exports = router;
