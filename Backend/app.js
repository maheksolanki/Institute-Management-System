const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const userRoutes = require('./routes/userRouter');
const studentRouter = require('./routes/studentRouter');
const courseRouter = require('./routes/courseRouter');
const feesRouter = require('./routes/feesRouter');

mongoose.connect('mongodb+srv://root:root@bapasitaram.d4mxzp0.mongodb.net/?retryWrites=true&w=majority&appName=Bapasitaram')
.then(
  ()=>{
    console.log('Database connected successfully');
  }
)
.catch(
  (err)=>{
    console.log('Database connection failed', err);
  }
)

app.use(bodyParser.json());// parse means convert the json data to javascript object

app.use(fileUpload({
    useTempFiles : true, // ano use jyre backend mathi koi image ave tyre tene ahi temporary store karse and pachhi cloudinary ma store thase.
    // tempFileDir : '/tmp/'
}));

app.use('/user',userRoutes);
app.use('/student', studentRouter);
app.use('/course', courseRouter);
app.use('/fees', feesRouter);


module.exports = app;