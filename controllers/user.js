const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Existing login function
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      msg: "Bad request. Please add email and password in the request body",
    });
  }

  let foundUser = await User.findOne({ email: req.body.email });
  if (foundUser) {
    const isMatch = await foundUser.comparePassword(password);

    if (isMatch) {
      const token = jwt.sign(
        { id: foundUser._id, name: foundUser.name },
        process.env.JWT_SECRET,
        {
          expiresIn: "30d",
        }
      );

      return res.status(200).json({ msg: "User logged in", token });
    } else {
      return res.status(400).json({ msg: "Bad password" });
    }
  } else {
    return res.status(400).json({ msg: "Bad credentials" });
  }
};

// Add new user function
const addNewUser = async (req, res) => {
  const { name, email, password, userType} = req.body;

  // Validate required fields
  if (!name || !email || !password || !userType) {
    return res.status(400).json({ msg: "Please provide all required fields" });
  }

  try {
    // Check if the user already exists
    let foundUser = await User.findOne({ email });
    if (foundUser) {
      return res.status(400).json({ msg: "Email already in use" });
    }

    // Create a new user
    const newUser = new User({
      name,
      email,
      password,
      userType
    });

    // Save the new user to the database
    await newUser.save();

    return res.status(201).json({ msg: "User added successfully", user: newUser });
  } catch (error) {
    console.error("Error adding new user:", error);
    return res.status(500).json({ msg: "Server error. Please try again later." });
  }
};

// Existing dashboard function
const dashboard = async (req, res) => {
  const luckyNumber = Math.floor(Math.random() * 100);

  res.status(200).json({
    msg: `Hello, ${req.user.name}`,
    secret: `Here is your authorized data, your lucky number is ${luckyNumber}`,
  });
};

const getAllUsers = async (req, res) => {
  try {
    let users = await User.find({ userType: { $in: ["Nurse", "Nutritionist", "Family Member"] } });
    return res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ msg: "Server error. Please try again later." });
  }
};

// Existing register function
const register = async (req, res) => {
  let foundUser = await User.findOne({ email: req.body.email });
  if (foundUser === null) {
    let { username, email, password } = req.body;
    if (username.length && email.length && password.length) {
      const person = new User({
        name: username,
        email: email,
        password: password,
      });
      await person.save();
      return res.status(201).json({ person });
    } else {
      return res.status(400).json({ msg: "Please add all values in the request body" });
    }
  } else {
    return res.status(400).json({ msg: "Email already in use" });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    return res.status(200).json({ msg: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ msg: "Server error. Please try again later." });
  }
};

module.exports = {
  login,
  register,
  dashboard,
  getAllUsers,
  addNewUser,
  deleteUser
};
