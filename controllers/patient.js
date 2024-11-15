const bcrypt = require("bcryptjs");
const BasicInformation = require("../models/BasicInformation"); // Assuming this model exists
const User = require("../models/User");

const uploadInfo = async (req, res) => {
    try {
        const {
            name,
            age,
            gender,
            contact,
            emergencyContactName,
            emergencyContactPhone,
            emergencyContactEmail // Add email to the required fields
        } = req.body;

        // Check if all required fields are present
        if (!name || !age || !gender || !contact || !emergencyContactName || !emergencyContactPhone || !emergencyContactEmail) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Create a new entry in BasicInformation
        const newEntry = new BasicInformation({
            name,
            age,
            gender,
            contact,
            emergencyContact: {
                name: emergencyContactName,
                phone: emergencyContactPhone,
                email: emergencyContactEmail // Adding email to emergency contact info
            }
        });

        // Save the BasicInformation entry
        await newEntry.save();

        // Set up default password and hash it
        const defaultPassword = "12345";
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        // Create a new entry in the User table with residentId referencing the newly created BasicInformation document
        const newUser = new User({
            name,
            email: emergencyContactEmail,
            password: hashedPassword,
            userType: "Family Member",
            residentId: newEntry._id // Set the residentId to the ID of the new BasicInformation entry
        });

        // Save the new User entry
        await newUser.save();

        // Send a success response with both entries
        res.status(201).json({ 
            message: 'Document and user saved successfully', 
            data: { resident: newEntry, user: newUser } 
        });
    } catch (error) {
        console.error('Error saving document:', error);
        if (error.name === 'ValidationError') {
            // Handle Mongoose validation errors
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: 'Validation error', errors: validationErrors });
        }
        res.status(500).json({ message: 'Error saving document', error: error.message });
    }
}

const getResidents = async (req, res) => {
    try {
      const patients = await BasicInformation.find(); // Assuming you're using BasicInformation model
      res.status(200).json(patients);
    } catch (error) {
      res.status(500).json({ message: "Error fetching residents", error });
    }
  }

const getPatients = async (req, res) => {
    try {
        const counts = await BasicInformation.aggregate([
            {
                $group: {
                    _id: "$month", // Group by month
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 } // Sort by month
            }
        ]);

        res.json(counts);
    } catch (error) {
        console.error("Error fetching patient counts:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { uploadInfo, getPatients, getResidents };
