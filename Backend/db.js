const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Replace the following with your actual MongoDB Atlas connection URI
    await mongoose.connect("mongodb+srv://TaskManagement:Lilian%252004@cluster0.mongodb.net/Taskify", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
