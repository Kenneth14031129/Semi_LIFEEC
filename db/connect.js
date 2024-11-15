const mongoose = require("mongoose");

const connectDB = (url) => {
  return mongoose.connect(url); // Simply pass the URL without options
};

module.exports = connectDB;
