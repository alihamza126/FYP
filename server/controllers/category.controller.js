import Category from '../models/category.js'


export async function listCategories(req, res) {
  const categories = await Category.find().sort('name')
  res.json({ categories })
}

// GET single category by ID (public)
export async function getCategory(req, res) {
  const { id } = req.params
  const category = await Category.findById(id)
  if (!category) return res.sendStatus(404)
  res.json({ category })
}

// CREATE category (admin)
export async function createCategory(req, res) {
  const data = req.body
  try {
    const newCategory = await Category.create(data)
    res.status(201).json({ category: newCategory })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

// UPDATE category (admin)
export async function updateCategory(req, res) {
  const { id } = req.params
  try {
    const updated = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!updated) return res.sendStatus(404)
    res.json({ category: updated })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

// DELETE category (admin)
export async function deleteCategory(req, res) {
  const { id } = req.params
  await Category.findByIdAndDelete(id)
  res.sendStatus(204)
}
