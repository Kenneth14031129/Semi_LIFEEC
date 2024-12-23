const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    senderId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    time: {
        type: Date,
        default: Date.now,
    },
    read: {  // Changed from isRead to read
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

module.exports = mongoose.model("Message", MessageSchema);
