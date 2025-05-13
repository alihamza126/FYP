import mongoose from 'mongoose'

const ShippingAddressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    shippingFirstName: { type: String, required: true },
    shippingLastName: { type: String, required: true },
    shippingCompany: { type: String, default: '' },
    shippingCountry: { type: String, required: true },
    shippingStreet: { type: String, required: true },
    shippingCity: { type: String, required: true },
    shippingState: { type: String, required: true },
    shippingZip: { type: String, required: true },
    shippingPhone: { type: String, required: true },
    shippingEmail: { type: String, required: true },
}, { timestamps: true })

// Use the singular model name "ShippingAddress":
export default mongoose.models.ShippingAddress ||
    mongoose.model('ShippingAddress', ShippingAddressSchema)
