const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/checkAuth");
const Course = require("../model/Course");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const coludinary = require("cloudinary").v2;

//It initializes/configures the Cloudinary SDK with your account credentials stored in environment variables.
 coludinary.config({   
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });

//1. api for adding a course
router.post("/add-course", checkAuth, (req, res) => {
  // ahi checkAuth token verify kare chhe token ne jo token verify ny thy to checkAuth mathi j return thase and agal no code run ny thase.

  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, "secretkey");

  coludinary.uploader.upload(req.files.image.tempFilePath,(err,result)=>{
    const newCourse = new Course({
    _id: new mongoose.Types.ObjectId(),
    courseName: req.body.courseName,
    price: req.body.price,
    description: req.body.description,
    startingDate: req.body.startingDate,
    endingDate: req.body.endingDate,
    uId: verify.uid, // aa uid token mati extract kariye chhe because je user ae login karyu hase aej course add kari sake chhe.
    imageUrl: result.secure_url, // this is the url of the image uploaded to cloudinary
    imageId: result.public_id, // this is the id of the image uploaded to cloudinary
  });
  newCourse.save()
  .then((result)=>{
    res.status(200).json({
      newCourse: result,
    })
  })
  .catch((err)=>{
    console.log(err);
    res.status(500).json({
      error :err
    })
  })
  })
});

//2. api for getting all courses from user
router.get('/all-courses', checkAuth , (req,res)=>{
  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, "secretkey");
  Course.find({
    uId : verify.uid // je user ae login karyu hase aej user na courses fetch karva mate.
  })
  .select('_id uId courseName price description startingDate endingDate imageUrl imageId')
  .then((result)=>{
    res.status(200).json({
      courses: result,
    })
  })
  .catch((err)=>{
    res.status(500).json({
      error : err,
    })
  })
})

//3. api for getting one course for any user
router.get('/course-detail/:id', checkAuth , (req,res)=>{

  Course.findById(req.params.id)
  .select('_id uId courseName price description startingDate endingDate imageUrl imageId')
  .then((result)=>{
    res.status(200).json({
      courses: result,
    })
  })
  .catch((err)=>{
    res.status(500).json({
      error : err,
    })
  })
})

//4. api for deleting a course
router.delete('/:id',checkAuth , (req,res)=>{

  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, "secretkey");

  Course.findById(req.params.id)
  .then((course)=>{
    console.log(course);
    if(course.uId == verify.uid){
      Course.findByIdAndDelete(req.params.id)
      .then((result)=>{
        coludinary.uploader.destroy(course.imageId,(deletedImage)=>{
          res.status(200).json({
            msg: "course deleted successfully",
            course: result,
          })
        })
      })
      .catch((err)=>
      {
        res.status(500).json({
          error: err,
        })
      })
    }
    else{
      res.status(500).json({
      msg: "bad request",
    })
    }
  })
})

//5. api for updating a course
router.put('/:id',checkAuth , (req,res)=>{
  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, "secretkey");
  console.log(verify.uid);

  Course.findById(req.params.id)
  .then((course)=>{
    console.log(course);
  })
  .catch((err)=>{
    res.status(500).json({                     
      error: err,
    })
  })
})

module.exports = router;
