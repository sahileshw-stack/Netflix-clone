require("dotenv").config();

const mongoose = require("mongoose");
const Admin = require("./Models/Admin");

async function createAdmin() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in .env");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Atlas connected");

    const email = "admin@netflix.com";
    const password = "Admin@123";

    const existingAdmin = await Admin.findOne({
      email,
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      console.log("Email:", existingAdmin.email);
      return;
    }

    await Admin.create({
      name: "Netflix Admin",
      email,
      password,
      role: "admin",
      isActive: true,
    });

    console.log("Admin created successfully");
    console.log("Email:", email);
    console.log("Password:", password);
  } catch (error) {
    console.error(
      "Create admin error:",
      error.message
    );
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  }
}

createAdmin();