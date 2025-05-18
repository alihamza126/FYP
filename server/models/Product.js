import mongoose from "mongoose"

const variationSchema = new mongoose.Schema({
  color: { type: String, required: true },
  colorCode: { type: String, required: true },
  colorImage: { type: String, required: true },
  image: { type: String, required: true },
})

const productSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    type: { type: String, required: true },
    name: { type: String, required: true },
    gender: { type: String, required: true },
    new: { type: Boolean, default: false },
    sale: { type: Boolean, default: false },
    rate: { type: Number, default: 0 },
    price: { type: Number, required: true },
    originPrice: { type: Number },
    brand: { type: String, required: true },
    sold: { type: Number, default: 0 },
    quantity: { type: Number, required: true },
    quantityPurchase: { type: Number, default: 1 },
    sizes: [{ type: String }],
    variation: [variationSchema],
    thumbImage: [{ type: String }],
    images: [{ type: String }],
    description: { type: String, required: true },
    action: { type: String },
    slug: { type: String, required: true, unique: true },

    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  },
  { timestamps: true },
)

// Create a text index for search functionality
productSchema.index({ name: "text", description: "text", brand: "text", category: "text" })

export default mongoose.models.Product || mongoose.model("Product", productSchema)
