1. first run the command npm init so our package.json file is creted
2. then we create server.js file which is our starting point
3. install express for best routing
npm install express
4. we create one app using express 
const app = express()

5. we create starting routes like 
app.use('/user',userRoutes);
app.use('/student', studentRouter);
app.use('/batch', batchRouter);
app.use('/fees', feesRouter);

when user send the request like this
http://localhost:300/user/something

for something we write code in userRouter or batchRouter or studentRouter or etc

6. we only take sample example of user router
const router = express.Router();

router.post('/signup',(req,res)=>{
  res.status(200).json({
    msg: "signup successfully",
  })
})

module.exports = router;

7. we install nodemone so that we can not require our server restart agian and again nodemon track the changes inside the server

8. we connect our application with mongodb database

for that install mongoose

npm install mongoose

then import it in app.js
const mongoose = require('mongoose');

the connect this with your app use mongoose.connect method
in this we put our connect url from mongodb cluster

go to the cluster-> click on connect -> click on driver -> copy the url and put in connect method like this and resolve promise

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

9. we install body parser : when we submit the data from frontend to backend it store inside the body so body mathi kadhva mate body parser nu jarur pade

10. imp : 
# Parsing ::	Converting raw request data (e.g., JSON string) into usable JavaScript objects

jyare form no only text data send thay to te json formate ma hoy and and we catch ny req.body

but if we want to send image also in data then it give us undefine.
so we need one library to read the image store in body

we use multer for this and also use express-fileupload

note : it mean jyare apde koi file k photo upload karvo hoy or get karvo hoy to apde multer or express file upload jevi vastu use karvi pade otherwise we don't get any data or get undefine

11. we use cloudinary to store our images
12. for that we need to install cloudinary library
    npm install cloudinary

13. We create the collection (table) for user or create the schema 
- for that we create the userSchema
- _id : mongoose.Types.ObjectId ::: this create the unique id for every user

14. for save the data on db we need to use .save() method 
 first we set the data send by ser using schema like this

 const newUser = new User({
          _id: new mongoose.Types.ObjectId(), // this is used to create a new unique id for the user
          firstName: req.body.firstName,
        });
        newUser.save()

- after the .svae method our data show in mongo compass

15. we store the bcrypt password in the db for protection and security
- for that we user bcrypt.hash(password which conver to hash ,saltRounds, callback)
- for this we need to install bcryptjs library using npm

16. next we create the api for login 
    http://localhost:3000/user/login

    - in this first we check entered email is exist in user schema or not 
    - if not exist we send status 500
    - if email is exist then we comapare hashed password with entered password
    - if both password is different send status 500 password in correct 
    - if correct then send user detail in response

17. Let next we create courses api........

- first crate api for adding the course
- only login student can add course so we send the token to identify user is login or not

# *************imp******************
## 🧑‍💻 Frontend (User):
- Sends login request to server → POST /login
- Sends email & password in request body
- Does not create the token
- Just waits for response

## Server (Your Express + Node backend):
- Verifies the user exists
- Compares hashed password with the one provided
- If valid: ✅
- Creates a JWT token using jwt.sign()
- Sends it back to the frontend in the response
 note : create token like this 
 `const token = jwt.sign(payload, secretKey, options);`

 ## Then What?
✅ Frontend receives the token, stores it in localStorage/sessionStorage
✅ Sends token with future requests for authentication (via headers)
✅ Server uses jwt.verify() to check if that token is valid

18. so finally after i understand how token is created by server and store in frontend we crate one middleware for recieve token from frontend and verify this token.
this verified token or user add the course.

- if we write like this 
  const token  = req.headers.authorization;
  to ae bearer space token return kare chhe but we not need bearer so we split it.
  so it return array of two element 1st is bearer and second is our token.
  (The word "Bearer" means “whoever holds the token has access”)

