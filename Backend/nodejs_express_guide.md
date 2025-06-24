# Node.js Express MongoDB Complete Guide

## 🚀 Initial Setup

### 1. Initialize Project
- Run `npm init` to create the `package.json` file
- This sets up your project with necessary metadata and dependencies

### 2. Create Entry Point
- Create `server.js` file as your application starting point
- This will be your main server file

### 3. Install Express Framework
```bash
npm install express
```
- Express provides excellent routing capabilities
- Essential for building REST APIs

## 🛠️ Express Application Setup

### 4. Create Express App
```javascript
const app = express()
```

### 5. Setup Main Routes
```javascript
app.use('/user', userRoutes);
app.use('/student', studentRouter);
app.use('/batch', batchRouter);
app.use('/fees', feesRouter);
```

**How it works:**
- When user sends request like `http://localhost:3000/user/something`
- The `/something` part is handled by `userRouter`
- Each router handles its specific endpoints

### 6. Sample User Router Implementation
```javascript
const router = express.Router();

router.post('/signup', (req, res) => {
  res.status(200).json({
    msg: "signup successfully",
  })
})

module.exports = router;
```

## 🔄 Development Enhancement

### 7. Install Nodemon
```bash
npm install nodemon
```
- **Purpose:** Automatically restarts server when code changes
- **Benefit:** No manual server restarts required during development
- Nodemon tracks file changes and restarts the application

## 🗄️ Database Connection

### 8. MongoDB Integration
```bash
npm install mongoose
```

**Import and Connect:**
```javascript
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://root:root@bapasitaram.d4mxzp0.mongodb.net/?retryWrites=true&w=majority&appName=Bapasitaram')
.then(() => {
    console.log('Database connected successfully');
})
.catch((err) => {
    console.log('Database connection failed', err);
})
```

**Steps to get MongoDB URL:**
1. Go to your MongoDB cluster
2. Click on "Connect"
3. Click on "Drivers"
4. Copy the connection URL
5. Replace credentials and database name

## 📝 Data Processing

### 9. Body Parser Installation
```bash
npm install body-parser
```
- **Purpose:** Parse incoming request data from frontend
- **Function:** Converts form data stored in request body to usable format
- Frontend data is stored in `req.body` and needs parsing

### 10. Understanding Data Parsing

**Important Concept:**
- **Parsing:** Converting raw request data (JSON string) into JavaScript objects
- Text data from forms comes in JSON format → accessible via `req.body`
- **Problem:** Image uploads return `undefined` without proper handling

**Solution for File Uploads:**
```bash
npm install multer
npm install express-fileupload
```
- **Note:** Required when uploading/receiving files or images
- Without these libraries, file data returns `undefined`

## ☁️ Cloud Storage

### 11. Cloudinary Integration
- Use Cloudinary for image storage in the cloud
- Better than storing images locally on server

### 12. Install Cloudinary
```bash
npm install cloudinary
```

## 🗃️ Database Schema

### 13. Create User Collection Schema
```javascript
const userSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId, // Creates unique ID for every user
  firstName: String,
  // ... other fields
});
```

### 14. Save Data to Database
```javascript
const newUser = new User({
  _id: new mongoose.Types.ObjectId(),
  firstName: req.body.firstName,
});

newUser.save()
```
- After `.save()` method, data appears in MongoDB Compass

## 🔐 Security Implementation

### 15. Password Encryption
```bash
npm install bcryptjs
```

**Usage:**
```javascript
bcrypt.hash(password, saltRounds, callback)
```
- Store hashed passwords in database for security
- Never store plain text passwords

### 16. Login API Implementation
**Endpoint:** `http://localhost:3000/user/login`

**Process:**
1. Check if entered email exists in user schema
2. If email doesn't exist → send status 500
3. If email exists → compare hashed password with entered password
4. If passwords don't match → send status 500 "password incorrect"
5. If passwords match → send user details in response

## 🎓 Course Management API

### 17. Course Addition Features
- Create API for adding courses
- **Security:** Only logged-in users can add courses
- Use tokens to verify user authentication

## 🔑 Authentication Flow

### Important Authentication Concept

#### 🧑‍💻 Frontend (User):
- Sends login request → `POST /login`
- Sends email & password in request body
- **Does NOT create the token**
- Waits for server response

#### 🖥️ Server (Express + Node backend):
- Verifies user exists in database
- Compares hashed password with provided password
- **If valid:** ✅
  - Creates JWT token using `jwt.sign()`
  - Sends token back to frontend

**Token Creation:**
```javascript
const token = jwt.sign(payload, secretKey, options);
```

#### 🔄 After Authentication:
- Frontend receives token
- Stores token in `localStorage`/`sessionStorage`
- Sends token with future requests (via headers)
- Server uses `jwt.verify()` to validate token

### 18. Token Verification Middleware

**Purpose:** Verify user authentication before allowing course addition

**Implementation:**
```javascript
const token = req.headers.authorization;
```

**Important Note:**
- This returns `"Bearer <token>"` format
- Need to split to extract actual token
- Array format: `[0] = "Bearer"`, `[1] = "actual_token"`
- **"Bearer"** means "whoever holds the token has access"

## 👨‍🎓 Student Management APIs

### 20. Add Student API
- **Process:** Same as adding courses
- Create new student using Student schema
- Save to database using `.save()` method

```javascript
const newStudent = new Student({
  _id: new mongoose.Types.ObjectId(),
  name: req.body.name,
  email: req.body.email,
  course: req.body.course,
  // ... other fields
});

newStudent.save()
```

### 21. Get All Students API

### 22. Get Students by Course API
**Endpoint:** `GET /student/course/:courseId`

### 23. Delete Student API
**Endpoint:** `DELETE /student/:id`

### 24. Update Student API
**Endpoint:** `PUT /student/:id`

### 25. Get Latest 5 Students API
**Endpoint:** `GET /student/latest`

**Explanation:**
- `.sort({ $natural: -1 })` → Sorts in reverse insertion order (latest added first)
- `.limit(5)` → Limits result to 5 documents
- **Result:** Gets 5 most recently added students

## 💰 Fee Management APIs

### 26. Fee Management System

#### Add Fee API
**Endpoint:** `POST /fees/add`

#### Get All Fees API
**Endpoint:** `GET /fees/all`

#### Get Fees for Specific Student API
**Endpoint:** `GET /fees/student/:studentId`

## 🎯 Key Takeaways

- **Express:** Handles routing and middleware
- **MongoDB + Mongoose:** Database operations
- **Bcrypt:** Password security
- **JWT:** User authentication
- **Multer:** File upload handling
- **Cloudinary:** Cloud storage for images
- **Nodemon:** Development efficiency
- **CRUD Operations:** Create, Read, Update, Delete for all entities
- **Population:** Link related documents (student details in fees)
- **Sorting & Limiting:** Efficient data retrieval for latest records