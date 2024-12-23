const mongoose = require('mongoose');
const Message = require('../models/Message');

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
    const { userId, contactId } = req.body;

    if (!userId || !contactId) {
        return res.status(400).json({ msg: "User ID and Contact ID are required." });
    }

    try {
        const result = await Message.updateMany(
            { 
                senderId: contactId,
                receiverId: userId,
                read: false 
            },
            { $set: { read: true } }
        );

        return res.status(200).json({
            msg: "Messages marked as read",
            updatedCount: result.modifiedCount
        });
    } catch (error) {
        console.error("Error marking messages as read:", error);
        return res.status(500).json({ msg: "Server error" });
    }
};

const getUnreadCounts = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log('Processing unread counts for userId:', userId);

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ msg: "Invalid user ID format" });
        }

        const unreadCounts = await Message.aggregate([
            {
                $match: {
                    receiverId: new mongoose.Types.ObjectId(userId),
                    read: false
                }
            },
            {
                $group: {
                    _id: "$senderId",
                    count: { $sum: 1 }
                }
            }
        ]);

        const unreadCountsObj = unreadCounts.reduce((acc, curr) => {
            acc[curr._id.toString()] = curr.count;
            return acc;
        }, {});

        console.log('Unread counts computed:', unreadCountsObj);
        return res.status(200).json({ unreadCounts: unreadCountsObj });

    } catch (error) {
        console.error('Error in getUnreadCounts:', error);
        return res.status(500).json({ 
            msg: "Server error while fetching unread counts",
            error: error.message 
        });
    }
};

module.exports = {
    sendMessage,
    getMessages,
    markMessagesAsRead,
    getUnreadCounts
};
