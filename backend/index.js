const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose')
const cors = require('cors'); 
const bcrypt = require("bcrypt");
const saltRounds = 10;

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'] 
}));

const SECRET = "S3cr31-keY";

const authenticateJwt = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
}

// Define mongoose schemas
const userSchema = new mongoose.Schema({
    username: String, 
    email: String,  
    password: String,
    purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
});

const adminSchema = new mongoose.Schema({
    username: String,
    password: String
});

const courseSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    imageLink: String,
    published: Boolean
});

// Define mongoose models
const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Course = mongoose.model('Course', courseSchema);

// Connect to MongoDB
mongoose.connect('mongodb+srv://omraw29:A9wtVWjLrymGJniY@cluster0.yxlp1.mongodb.net', {
    dbName: "course-app"
})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    });

// Admin routes
app.post('/admin/signup', async (req, res) => {
    const { username, password } = req.body;

    // Check if the admin already exists
    const existingUser = await Admin.findOne({ username });
    if (existingUser) {
        return res.status(403).json({ message: "Admin already exists" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const newAdmin = new Admin({ username, password: hashedPassword });
    await newAdmin.save();

    // Create a token for the new admin
    const token = jwt.sign({ username, role: 'admin' }, SECRET, { expiresIn: '1h' });
    
    return res.status(201).json({ message: 'Admin created successfully', token });
});

app.post('/admin/login', async (req, res) => {
    const { username, password } = req.body; // Get credentials from body
    const admin = await Admin.findOne({ username });
    
    if (admin && await bcrypt.compare(password, admin.password)) { // Compare hashed passwords
        const token = jwt.sign({ username, role: 'admin' }, SECRET, { expiresIn: '1h' });
        return res.json({ message: 'Logged in successfully', token });
    } else {
        return res.status(403).json({ message: "Invalid credentials" });
    }
});

app.post('/admin/courses', authenticateJwt, async (req, res) => {
    // logic to create a course
    const newCourse = new Course(req.body);
    await newCourse.save();
    res.json({ message: 'Course created successfully', courseId: newCourse.id });
});

app.put('/admin/courses/:courseId', authenticateJwt, async (req, res) => {
    // logic to edit a course
    try {
        const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, { new: true });
        if (course) {
            res.json({ message: 'Course updated successfully' });
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.get('/admin/courses', authenticateJwt, async (req, res) => {
    // logic to get all courses
    const courses = await Course.find({});
    res.send({ courses: courses.map(course => ({
        id: course._id, 
        title: course.title,
        description: course.description,
        imageLink: course.imageLink,
        price: course.price
    })) });
});

app.get('/admin/courses/:courseId', authenticateJwt, async (req, res) => {
    try {
        const { courseId } = req.params; // Get courseId from request parameters

        // Find the course by ID
        const course = await Course.findById(courseId);
        
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Send course details along with the ID
        res.send({
            id: course._id,
            title: course.title,
            description: course.description,
            imageLink: course.imageLink,
            price: course.price
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


app.get('/admin/username', authenticateJwt, (req, res) => {
    res.json({ username: req.user.username });
  });

// User routes
app.post('/users/signup', async (req, res) => {
    // logic to sign up user
    try {
        const { username,email,password } = req.body;
   
        if(!username || !email || !password){
           return res.status(400).json({ message: "All fields are mandatory" });
        }
   
        const userAvailable = await User.findOne({email});
        if(userAvailable){
           return res.status(400).json({ message: "User already registered" });
        }
   
        const hashedPassword = await bcrypt.hash(password,10);
        const user = await User.create({
            username,
            email,
            password:hashedPassword,
        })
   
        if(user){
           res.status(200).json({ _id:user.id, email:user.email, username: user.username, password:hashedPassword})
        }
   
       } catch (error) {
           res.status(500).json({ message: error.message });
       }
});

app.post('/users/login', async (req, res) => {
    // logic to log in user
    try {

        const { username,password } = req.body;
    
        if(!username || !password){
            res.status(400);
            throw new Error("All fields are necessary");
        }
    
        const user = await User.findOne({username})
    
        if(user && (await bcrypt.compare(password, user.password))){
    
           const token = jwt.sign(                       
            {id: user._id, username: user.username},       //Encoding User Information: in token
           "SECRET",
            {expiresIn : '1h'}
           );
          
        return res.status(200).json({
            _id: user.id,
            username: user.username,
            token
        })
            
        } 
        return res.status(401).json({ message: "Invalid username or password" });
            
        } catch (error) {
            res.status(401).json({message: "Invalid email or password"});
        }
});

app.get('/users/courses', authenticateJwt, async (req, res) => {
    // logic to list all courses
    const courses = await Course.find({ published: true });
    res.json({ courses });
});

app.post('/users/courses/:courseId', authenticateJwt, async (req, res) => {
    // logic to purchase a course
    try {
        const course = await Course.findById(req.params.courseId);
        if (course) {
            const user = await User.findOne({ username: req.user.username });
            if (user) {
                user.purchasedCourses.push(course);
                await user.save();
                res.json({ message: 'Course purchased successfully' });
            } else {
                res.status(403).json({ message: 'User not found' });
            }
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.get('/users/purchasedCourses', authenticateJwt, async (req, res) => {
    // logic to view purchased courses
    const user = await User.findOne({ username: req.user.username }).populate('purchasedCourses');
    if (user) {
        res.json({ purchasedCourses: user.purchasedCourses || [] });
    } else {
        res.status(403).json({ message: 'User not found' });
    }
});

app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
