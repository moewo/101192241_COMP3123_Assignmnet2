exports.signup = async (req, res) => {
  console.log("Signup body:", req.body); 

  const errors = validationResult(req);
  
};
exports.login = async (req, res) => {
  console.log("Login body:", req.body); 

  const errors = validationResult(req);
  
};

const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");


exports.signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: false, errors: errors.array() });
  }

  const { username, email, password } = req.body;

  try {
    
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ status: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "User created successfully.",
      user_id: user._id.toString(),
    });
  } catch (error) {
    console.error("Signup error:", error.message);
    return res.status(500).json({ status: false, message: "Server error" });
  }
};



exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: false, errors: errors.array() });
  }

  const { username, email, password } = req.body;

  try {
    if (!username && !email) {
      return res
        .status(400)
        .json({ status: false, message: "Username or email is required" });
    }

    const user = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (!user) {
      return res.status(401).json({
        status: false,
        message: "Invalid Username and password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: false,
        message: "Invalid Username and password",
      });
    }

    
    let token = null;
    if (process.env.JWT_SECRET) {
      token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
    }

    return res.status(200).json({
      message: "Login successful.",
      jwt_token: token ? token : "Optional implementation",
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ status: false, message: "Server error" });
  }
};