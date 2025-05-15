import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import UserModel from "../server/models/User.js"; // Adjust path if needed

dotenv.config({
   path: "./.env.local",
}); // Load .env variables

const createAdmin = async () => {
  try {
    // ✅ Connect to MongoDB
    const db = await mongoose.connect(process.env.MONGODB_URI || "");
    const isConnected = db.connections[0].readyState === 1;

    if (isConnected) {
      console.log("✅ Connected to MongoDB");
    } else {
      console.error("❌ Failed to connect to MongoDB");
      process.exit(1);
    }

    // ✅ Check if an admin already exists
    const existingAdmin = await UserModel.findOne({ role: "admin" });

    if (existingAdmin) {
      console.log("⚠️  Admin already exists:", existingAdmin.email);
      process.exit(1);
    }

    // ✅ Create admin data
    const userData = {
      username: "Ali Hamza",
      email: "admin@admin.com",
      password: await bcrypt.hash("Hamza@126", 10),
      isVerfied: true,
      isAdmin: true,
      role: "admin",
    };

    const newAdmin = new UserModel(userData);
    await newAdmin.save();

    console.log(`🎉 Admin created: ${newAdmin.email}`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();
