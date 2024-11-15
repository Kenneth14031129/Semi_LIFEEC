const Message = require("../models/Message");

// Send a new message
const sendMessage = async (req, res) => {
    const { senderId, receiverId, text } = req.body;

    // Validate required fields
    if (!senderId || !receiverId || !text) {
        return res.status(400).json({ msg: "All fields are required." });
    }

    try {
        const message = new Message({
            senderId,
            receiverId,
            text,
            time: new Date(),
            isRead: false, // Initialize as unread
        });

        await message.save();
        return res.status(201).json({
            msg: "Message sent successfully",
            message,
        });
    } catch (error) {
        console.error("Error sending message:", error);
        return res.status(500).json({
            msg: "Server error. Please try again later.",
        });
    }
};

// Get messages between two users
const getMessages = async (req, res) => {
    const { senderId, receiverId } = req.params;

    if (!senderId || !receiverId) {
        return res.status(400).json({ msg: "Sender ID and Receiver ID are required." });
    }

    try {
        const messages = await Message.find({
            $or: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId },
            ],
        }).sort({ time: 1 }); // Sort messages by time in ascending order

        return res.status(200).json({ messages });
    } catch (error) {
        console.error("Error fetching messages:", error);
        return res.status(500).json({
            msg: "Server error. Please try again later.",
        });
    }
};

// Mark all messages from a sender as read for a specific receiver
const markMessagesAsRead = async (req, res) => {
    const { senderId, receiverId } = req.body;

    if (!senderId || !receiverId) {
        return res.status(400).json({ msg: "Sender ID and Receiver ID are required." });
    }

    try {
        const result = await Message.updateMany(
            { senderId, receiverId, isRead: false },
            { $set: { isRead: true } }
        );

        return res.status(200).json({
            msg: "Messages marked as read.",
            updatedCount: result.nModified, // Provides feedback on how many messages were marked as read
        });
    } catch (error) {
        console.error("Error marking messages as read:", error);
        return res.status(500).json({
            msg: "Server error. Please try again later.",
        });
    }
};

module.exports = {
    sendMessage,
    getMessages,
    markMessagesAsRead,
};
