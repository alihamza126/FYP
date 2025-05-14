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
