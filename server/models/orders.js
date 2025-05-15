// models/Order.js
import mongoose from "mongoose"
import { customAlphabet } from "nanoid"

const numericId = customAlphabet('0123456789', 8)

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        unique: true,
        default: () => numericId(),
    },

    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            quantity: Number,
        },
    ],
    shippingInfo: {
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        country: String,
        city: String,
        address: String,
        state: String,
        zip: String,
    },
    paymentIntentId: String,
    amount: Number,
    currency: String,
    status: {
        type: String,
        enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
        default: "pending"
    },
    isCod: { type: Boolean, default: false },
    paidAt: Date,
})

export default mongoose.models.Order || mongoose.model("Order", orderSchema)
