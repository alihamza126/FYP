import mongoose from 'mongoose'

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  image: { type: String, required: true },
}, { timestamps: true })

export default mongoose.models.Category || mongoose.model('Category', CategorySchema)