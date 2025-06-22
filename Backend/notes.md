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

## 19. Course Management API - Delete & Update Operations

## 🗑️ Delete Course API

### **Endpoint:** `DELETE /:id`
- **Parameter:** `req.params.id` - Course ID from URL

### **Cloudinary Methods:**
- **Upload:** `cloudinary.uploader.upload()`
- **Delete:** `cloudinary.uploader.destroy()`

### **Delete Process Steps:**
1. **User Authentication**
   - Verify user token
   
2. **Course Identification**
   - Find course using parameter ID
   
3. **Validation**
   - Check if course exists
   - Return course details if found
   
4. **Authorization & Deletion**
   - Match course ID with verified user ID
   - If authorized:
     - Destroy image from Cloudinary
     - Delete course from database

---

## 20. 🔄 Update Course API

### **HTTP Methods:**
- **PUT:** Updates all fields (replaces entire resource)
  - Requires all data from frontend
  - Missing fields become null
  
- **PATCH:** Updates specific fields only
  - Accepts partial data
  - Only modifies provided fields

### **Update Process Steps:**
1. **User Authentication**
   - Check if user is logged in
   
2. **Image Handling Logic**
   - **No new image uploaded:**
     - Keep existing image unchanged
   
   - **New image uploaded:**
     - Delete old image from Cloudinary
     - Upload new image to Cloudinary
     - Update course with new image URL

### **When to Use Each Method:**
- **PUT:** Complete course data replacement
- **PATCH:** Partial updates (recommended for single field changes)


20. Let create apis for student first create api for add student 
it is same like we add the course
first create the new student of Student schema and save this using .save() method.

21. crete the api for get all student

22. crete the api geting all student of perticular course

23. create api for delete student

24. create api for updating te student.



## 🎯 Key Takeaways

- **Express:** Handles routing and middleware
- **MongoDB + Mongoose:** Database operations
- **Bcrypt:** Password security
- **JWT:** User authentication
- **Multer:** File upload handling
- **Cloudinary:** Cloud storage for images
- **Nodemon:** Development efficiency