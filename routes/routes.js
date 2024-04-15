const express = require("express");
const User = require("../models/models.js");
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");

dotenv.config();

//authen is middleware for authentication

const authen = (req, res, next) => {
    console.log(req.headers.authorization)
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).send('Access denied. No token provided.');
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (ex) {
      res.status(400).send('Invalid token.');
    }
  };
  

//This is the api for login

router.get("/login" ,async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign(
            { userId: user.email },
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );
        res.json({
            message: "Login successful",
            token: token
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

//This is the api to get all users

router.get("/allUsers", authen , async (req, res) => {

    try {
        const userData = await User.find({}); 
        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        } else {
            console.log("authenticated");
            res.json({
                message: "Users data",
                userData: userData
            });
        }
    } catch (err) {
        console.error(err); 
        res.status(500).json({ message: "Server error" });
    }
});


//This is the api for getting single user

router.get("/getUser/", async (req, res) => {
    const { email } = req.body; 

    try {
        const userData = await User.findOne({ email: email }); 
        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        } else {
            res.json({
                message: "User exists",
                userData: userData
            });
        }
    } catch (err) {
        console.error(err); 
        res.status(500).json({ message: "Server error" });
    }
});

//This is the api for signup

router.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const userAdded = await User.create({
        username:username,
        email: email,
        password: hashedPassword,
      });
      res.status(201).json(userAdded);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  });

module.exports = router;