require("dotenv").config();

const mongoose = require("mongoose");
const Admin = require("./Models/Admin");

async function createAdmin() {
  try {
    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log("MongoDB connected");

    const email = "admin@netflix.com";
    const password = "Admin@123";

    const existingAdmin = await Admin.findOne({
      email,
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      return;
    }

    const admin = await Admin.create({
      name: "Netflix Admin",
      email,
      password,
      role: "admin",
      isActive: true,
    });

    console.log("Admin created successfully");
    console.log("Email:", admin.email);
    console.log("Password:", password);
  } catch (error) {
    console.error(
      "Create admin error:",
      error
    );
  } finally {
    await mongoose.connection.close();
  }
}

createAdmin();