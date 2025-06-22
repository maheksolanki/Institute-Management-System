const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  _id : mongoose.Types.ObjectId,
  fullName : {
    type : String,
    required : true
  },
  phone : {
    type : String,
    required : true
  },
  email:{
    type : String,
    required : true
  },
  address : {
    type : String,
    required : true
  },
  
  imageId : {
    type : String,
    required : true
  },
  imageUrl : {
    type : String,
    required : true
  },
  courseId : {
    type : String,
    required : true
  },
  uId : { // kon aa course add kare chhe te user ni id
    type : String,
    required : true
  }
} , {timestamps : true}); // timestamps : true means createdAt and updatedAt will be added automatically

module.exports = mongoose.model('Student', studentSchema);