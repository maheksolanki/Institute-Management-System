const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/checkAuth");
const Student = require("../model/Student");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

//1. api for adding a student
router.post("/add-student", checkAuth, (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, "secretkey");

  cloudinary.uploader.upload(req.files.image.tempFilePath, (err, result) => {
    const newStudent = new Student({
      _id: new mongoose.Types.ObjectId(),
      fullName: req.body.fullName,
      phone: req.body.phone,
      email: req.body.email,
      courseId: req.body.courseId, // je course ma student add karva ma aave chhe
      address: req.body.address,
      uId: verify.uid,
      imageId: result.public_id,
      imageUrl: result.secure_url,
    });

    newStudent
      .save()
      .then((result) => {
        res.status(200).json({
          newStudent: result,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
  });
});

//2 api for getting all students of a user

router.get("/all-students", checkAuth, (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, "secretkey");

  Student.find({ uId: verify.uid })
    .select("_id fullName phone email address imageId imageUrl courseId uId")
    .then((result) => {
      res.status(200).json({
        students: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

//3. api for getting all students of a perticular course
router.get("/all-students/:courseId", checkAuth, (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, "secretkey");

  Student.find({ uId: verify.uid, courseId: req.params.courseId })
    .select("_id fullName phone email address imageId imageUrl courseId uId")
    .then((result) => {
      res.status(200).json({
        students: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

// 4. api for deleting a student
router.delete("/:id", checkAuth, (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, "secretkey");

  Student.findById(req.params.id)
    .then((student) => {
      console.log(student);
      if (student.uId == verify.uid) {
        Student.findByIdAndDelete(req.params.id)
          .then((result) => {
            cloudinary.uploader.destroy(student.imageId, (deletedImage) => {
              res.status(200).json({
                msg: "student deleted successfully",
                student: result,
              });
            });
          })
          .catch((err) => {
            res.status(500).json({
              error: err,
            });
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

//5. api for updating a student

router.put('/:id',checkAuth , (req,res)=>{
  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, "secretkey");
  console.log(verify.uid);

  Student.findById(req.params.id)
  .then((student)=>{
    if(verify.uid != student.uId){
      return res.status(500).json({
        error: "you are not authorized to update this student",
      })
    }
    if(req.files){
      cloudinary.uploader.destroy(student.imageId, (deletedImage)=>{
       cloudinary.uploader.upload(req.files.image.tempFilePath,(err, result)=>{
        const newUpdatedStudent = {
          fullName: req.body.fullName,
          phone: req.body.phone,
          email: req.body.email,
          courseId: req.body.courseId, // je course ma student add karva ma aave chhe
          address: req.body.address,
          uId: verify.uid,
          imageId: result.public_id,
          imageUrl: result.secure_url,
        }

        Student.findByIdAndUpdate(req.params.id , newUpdatedStudent,{new : true})
        .then((data)=>{
          res.status(200).json({
            newUpdatedStudent : data,
          })
        })
        .catch((err)=>{
          console.log(err);
          res.status(500).json({
            error:err,
          })
        })
       })
      })
    }else{ // if file is not selected then we will not update the image
      const newUpdatedStudent = {
          fullName: req.body.fullName,
          phone: req.body.phone,
          email: req.body.email,
          courseId: req.body.courseId, // je course ma student add karva ma aave chhe
          address: req.body.address,
          uId: verify.uid,
          imageId: student.imageId, 
          imageUrl: student.imageUrl,
      }
      Student.findByIdAndUpdate(req.params.id, newUpdatedStudent , {new:true})
      .then((data) => {
        res.status(200).json({
          newUpdatedStudent : data,
        })
      })
      .catch((err)=>{
        console.log(err);
        res.status(500).json({
            error:err,
        })
      })
    }
  })
  .catch((err)=>{
    res.status(500).json({                     
      error: err,
    })
  })
})
//6. get latest 5 students dataSt
router.get('/latest-students',checkAuth,(req,res)=>{
  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, "secretkey");

  Student.find({uId : verify.uid})
  .sort({$natural :-1}).limit(5)// Sort by natural order to get the latest documents
  .then((result)=>{
    res.status(200).json({
      students: result,
    })
  })
  .catch((err)=>{
    res.status(500).json({
      error: err,
    })
  })

})
module.exports = router;
