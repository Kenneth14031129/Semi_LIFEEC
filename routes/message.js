const express = require("express");
const { sendMessage, getMessages, markMessagesAsRead } = require("../controllers/message");

const router = express.Router();

router.post("/send", sendMessage); // POST /api/v1/messages/send
router.get("/:senderId/:receiverId", getMessages); // GET /api/v1/messages/:senderId/:receiverId
router.put("/mark-as-read", markMessagesAsRead); // PUT /api/v1/messages/mark-as-read

module.exports = router;
