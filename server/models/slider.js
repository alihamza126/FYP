import mongoose from 'mongoose'

const SliderSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
}, { timestamps: true })

// Use the singular model name "ShippingAddress":
export default mongoose.models.SliderSchema ||
    mongoose.model('SliderSchema', SliderSchema)
