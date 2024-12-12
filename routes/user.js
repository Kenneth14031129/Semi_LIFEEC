const express = require("express");
const router = express.Router();

const { login, register, dashboard, getAllUsers, addNewUser, deleteUser } = require("../controllers/user");
const { uploadInfo, getPatients } = require("../controllers/patient");
const authMiddleware = require('../middleware/auth');

// Patient routes
router.route("/upload-info").post(uploadInfo);
router.route("/patients-per-month").get(getPatients);

// User routes
router.route("/login").post(login);
router.route("/register").post(register);
router.route("/dashboard").get(authMiddleware, dashboard);
router.route("/users").get(getAllUsers);
router.route("/add-user").post(addNewUser);
router.route("/delete/:id").delete(deleteUser);

module.exports = router;
