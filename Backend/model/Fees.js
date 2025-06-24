const mongoose = require('mongoose');

const feesSchema = new mongoose.Schema({
  _id : mongoose.Types.ObjectId,
  fullName : {
    type : String,
    required : true
  },
  phone : {
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
  },
  amount : {
    type : Number,
    required : true
  },
  remark : {
    type :String,
    required : true
  }
} , {timestamps : true}); // timestamps : true means createdAt and updatedAt will be added automatically

module.exports = mongoose.model('Fees', feesSchema);