const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User"); // Adjust path to your User model if necessary

// Connection to the database
const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://wronnwronn:dikoalam@cluster0.patqlb6.mongodb.net/yourdbname?retryWrites=true&w=majority", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB successfully.");
    } catch (error) {
        console.error("Database connection error:", error);
        process.exit(1); // Exit with failure
    }
};

// Seed data
const seedUsers = async () => {
    try {
        // Clear existing users
        await User.deleteMany({}); // Optional: Remove this line if you don't want to delete existing users

        // Password hashing
        const salt = await bcrypt.genSalt(10);

        // User data to insert
        const users = [
            {
                name: "Owner User",
                email: "owner@example.com",
                password: await bcrypt.hash("12345", salt),
                userType: "Owner",
            },
            {
                name: "Admin User",
                email: "admin@example.com",
                password: await bcrypt.hash("12345", salt),
                userType: "Admin",
            },
        ];

        // Insert the users
        await User.insertMany(users);
        console.log("Users seeded successfully.");

        process.exit(); // Exit the process when done
    } catch (error) {
        console.error("Error seeding users:", error);
        process.exit(1);
    }
};

// Connect to DB and seed users
connectDB().then(seedUsers);
