const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcryptjs")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")

// Load environment variables
dotenv.config()

// Create Express app
const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/user-management")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Import User Model
const UserModel = require("./models/User")

// Authentication Middleware
const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token

    if (!token) {
      return res.status(401).json({ message: "Authentication required" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")
    const user = await UserModel.findById(decoded.id)

    if (!user) {
      return res.status(401).json({ message: "User not found" })
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" })
  }
}

// API Routes

// Get all users (admin only)
app.get("/api/users", isAuthenticated, async (req, res) => {
  try {
    const users = await UserModel.find().select("-password")
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get user by ID (admin only)
app.get("/api/users/:id", isAuthenticated, async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id).select("-password")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json(user)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Create new user (admin only)
app.post("/api/users", isAuthenticated, async (req, res) => {
  try {
    const { username, email, password, role, isVerfied, isAdmin, ...userData } = req.body

    // Check if username or email already exists
    const existingUser = await UserModel.findOne({
      $or: [{ username }, { email }],
    })

    if (existingUser) {
      return res.status(400).json({
        message: `${existingUser.username === username ? "Username" : "Email"} already exists`,
      })
    }

    // Hash password if provided
    let hashedPassword
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10)
    }

    // Create new user
    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
      role,
      isVerfied,
      isAdmin: role === "admin" ? true : isAdmin,
      ...userData,
    })

    await newUser.save()

    // Return user without password
    const userResponse = newUser.toObject()
    delete userResponse.password

    res.status(201).json(userResponse)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Update user (admin only)
app.put("/api/users/:id", isAuthenticated, async (req, res) => {
  try {
    const { username, email, password, role, isVerfied, isAdmin, ...userData } = req.body

    // Check if username or email already exists (excluding current user)
    if (username || email) {
      const existingUser = await UserModel.findOne({
        $and: [
          { _id: { $ne: req.params.id } },
          { $or: [...(username ? [{ username }] : []), ...(email ? [{ email }] : [])] },
        ],
      })

      if (existingUser) {
        return res.status(400).json({
          message: `${existingUser.username === username ? "Username" : "Email"} already exists`,
        })
      }
    }

    // Prepare update data
    const updateData = {
      ...(username && { username }),
      ...(email && { email }),
      ...(role && { role }),
      ...(isVerfied !== undefined && { isVerfied }),
      ...(isAdmin !== undefined && { isAdmin }),
      ...userData,
      updatedAt: Date.now(),
    }

    // Hash password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 10)
    }

    // Update user
    const updatedUser = await UserModel.findByIdAndUpdate(req.params.id, updateData, { new: true }).select("-password")

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json(updatedUser)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Delete user (admin only)
app.delete("/api/users/:id", isAuthenticated, async (req, res) => {
  try {
    const deletedUser = await UserModel.findByIdAndDelete(req.params.id)

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json({ message: "User deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Admin login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user by email
    const user = await UserModel.findOne({ email })

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    // Check if user is admin
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" })
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "1d" })

    // Set token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    })

    // Return user without password
    const userResponse = user.toObject()
    delete userResponse.password

    res.json({
      message: "Login successful",
      user: userResponse,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Logout
app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("token")
  res.json({ message: "Logout successful" })
})

// Get current admin user
app.get("/api/auth/me", isAuthenticated, (req, res) => {
  const userResponse = req.user.toObject()
  delete userResponse.password

  res.json(userResponse)
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
