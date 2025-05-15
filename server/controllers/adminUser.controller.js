import bcrypt from 'bcryptjs'
import Usermodel from '../models/User.js'

// List all users (admin only)
export async function listUsers(req, res, next) {
  try {
    const users = await Usermodel.find().select('-password')
    res.json({ users })
  } catch (err) {
    next(err)
  }
}

// Get single user by ID (admin only)
export async function getUser(req, res, next) {
  try {
    const { id } = req.params
    const user = await Usermodel.findById(id).select('-password')
    if (!user) return res.sendStatus(404)
    res.json({ user })
  } catch (err) {
    next(err)
  }
}

// Update existing user (admin only)
export async function updateUser(req, res, next) {
  try {
    const { id } = req.params
    const updateData = { ...req.body }
    // If updating password, hash it
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10)
    }
    const updated = await Usermodel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
      context: 'query',
    }).select('-password')
    if (!updated) return res.sendStatus(404)
    res.json({ user: updated })
  } catch (err) {
    next(err)
  }
}

export async function createUser(req, res, next) {
  try {
    const { username, email, password, role, isVerfied, isAdmin, ...userData } = req.body

    // Check if username or email already exists
    const existingUser = await Usermodel.findOne({
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
    const newUser = new Usermodel({
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
}

// Delete user (admin only)
export async function deleteUser(req, res, next) {
  try {
    const { id } = req.params
    console.log(id)
    await Usermodel.findByIdAndDelete(id)
    res.sendStatus(204)
  } catch (err) {
    next(err)
  }
}
