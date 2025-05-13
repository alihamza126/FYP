// backend/src/controllers/address.controller.js
import ShippingAddress from '../models/ShippingAddress.js'

export async function listAddresses(req, res, next) {
  const userId = req.user.id
  const addresses = await ShippingAddress.find({ userId }).sort('-createdAt')
  res.json({ addresses })
}

export async function createAddress(req, res, next) {
  const userId = req.user.id
  const addr = await ShippingAddress.create({ userId, ...req.body })
  res.status(201).json({ address: addr })
}

export async function updateAddress(req, res, next) {
  const userId  = req.user.id
  const { id }  = req.params
  const addr    = await ShippingAddress.findOneAndUpdate(
    { _id: id, userId },
    req.body,
    { new: true, runValidators: true }
  )
  if (!addr) return res.sendStatus(404)
  res.json({ ShippingAddress: addr })
}

export async function deleteAddress(req, res, next) {
  const userId = req.user.id
  const { id } = req.params
  await ShippingAddress.findOneAndDelete({ _id: id, userId })
  res.sendStatus(204)
}
