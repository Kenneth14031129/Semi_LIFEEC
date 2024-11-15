const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    senderId: {
        type: Schema.Types.ObjectId,
        ref: "User", // Assuming you have a User model
        required: true,
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: "User", // Assuming you have a User model
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    time: {
        type: Date,
        default: Date.now, // Automatically set to current date and time
    },
    isRead: {
        type: Boolean,
        default: false, // Optional: flag to track if the message has been read
    },
}, { timestamps: true }); // Adds createdAt and updatedAt fields automatically

module.exports = mongoose.model("Message", MessageSchema);
