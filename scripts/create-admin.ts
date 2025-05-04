import { User } from "../src/shared/models/User";
import * as dotenv from "dotenv";
import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from the root .env file
config({ path: resolve(__dirname, "../.env") });

async function createAdmin() {
  try {
    const email = process.env.ADMIN_EMAIL;
    const name = process.env.ADMIN_NAME;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !name || !password) {
      console.error(
        "Missing required environment variables. Please set ADMIN_EMAIL, ADMIN_NAME, and ADMIN_PASSWORD in your .env file."
      );
      process.exit(1);
    }

    console.log("Checking for existing admin user...");
    const existingUser = await User.findByEmail(email);

    if (existingUser) {
      console.log("Admin user already exists with email:", email);
      process.exit(0);
    }

    console.log("Creating new admin user...");
    const hashedPassword = await User.hashPassword(password);

    const user = await User.create({
      email,
      name,
      hashedPassword,
      role: "ADMIN",
    });

    console.log("Admin user created successfully!");
    console.log({
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
}

// Run the script
createAdmin().catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});
