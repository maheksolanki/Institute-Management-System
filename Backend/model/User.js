const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  _id : mongoose.Types.ObjectId,
  firstName : {
    type: String,
    required: true
  },
  lastName : {
    type: String,
    required: true
  },
  email : {
    type: String,
    required: true,
    // unique: true
  },
  password : {
    type : String,
    required : true
  },
  imageUrl  :{
    type : String,
    required: true
  },
  imageId : {
    type : String,
    required: true
  }

})

module.exports = mongoose.model('User', userSchema); // ahi user lkhyu chhe to db ni andar users name nu collection banse.