const express = require("express");
const { sendMessage, getMessages, markMessagesAsRead, getUnreadCounts } = require("../controllers/message");

const router = express.Router();

// Put the /unread route BEFORE the dynamic route
router.get("/unread/:userId", getUnreadCounts);
router.post("/send", sendMessage);
router.post("/mark-read", markMessagesAsRead);
// Put this dynamic route LAST
router.get("/:senderId/:receiverId", getMessages);

module.exports = router;
