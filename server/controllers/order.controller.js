import Order from '../models/orders.js'


export async function createOrder({ userId, items, shippingInfo, paymentIntentId = null, amount, currency = 'pkr', status = "pending", isCod = false }) {
    try {

        // Basic validation
        if (!Array.isArray(items) || items.length === 0) {
            throw new Error('Invalid or empty cart')
        }

        // Map incoming items to the schema shape
        const formattedItems = items.map(i => ({
            productId: i.productId,
            quantity: i.quantity
        }))

        const order = await Order.create({
            userId: userId,
            items: formattedItems,
            shippingInfo,
            paymentIntentId,
            amount,
            currency,
            status,
            isCod,
            paidAt: new Date()
        });
        return order;
    } catch (err) {
        console.log(err)
    }
};



// Create a new order (authenticated user)
export async function create(req, res, next) {
    try {
        const { items, shippingInfo, amount } = req.body;

        const formattedItems = items.map(i => ({
            productId: i.productId,
            quantity: i.quantity || 1,
        }))

        const order = await createOrder({
            userId: req.user.id,
            items: formattedItems,
            shippingInfo,
            amount,
            isCod: true,
            status: 'piad',
            paidAt: new Date(),
        });

        res.status(201).json({ order })
    } catch (err) {
        next(err)
    }
}

export async function getMyOrders(req, res, next) {
    try {
        const orders = await Order.find({ userId: req.user.id })
            .populate('items.productId', 'name price')
            .sort('-createdAt')
        res.json({ orders })
    } catch (err) {
        next(err)
    }
}

// List all orders (admin only)
export async function listOrders(req, res, next) {
    try {
        const orders = await Order.find()
            .populate('userId', 'username email')
            .populate('items.productId', 'name price')
            .sort('-createdAt')
        res.json({ orders })
    } catch (err) {
        next(err)
    }
}

// Get a single order by ID (admin)
export async function getOrder(req, res, next) {
    try {
        const { id } = req.params
        const order = await Order.findById(id)
            .populate('userId', 'username email')
            .populate('items.productId', 'name price')
        if (!order) return res.sendStatus(404)
        res.json({ order })
    } catch (err) {
        next(err)
    }
}

// Update order status (admin)
export async function updateOrderStatus(req, res, next) {   
    try {
        const { id } = req.params
        const { status } = req.body
        const validStatuses = ['pending', 'paid', 'shipped', 'delivered', 'cancelled']
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' })
        }

        const order = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        )
        if (!order) return res.sendStatus(404)
        res.json({ order })
    } catch (err) {
        next(err)
    }
}

// Delete an order (admin)
export async function deleteOrder(req, res, next) {
    try {
        const { id } = req.params
        const order = await Order.findByIdAndDelete(id)
        if (!order) return res.sendStatus(404)
        res.sendStatus(204)
    } catch (err) {
        next(err)
    }
}
