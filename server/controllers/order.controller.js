import Order from '../models/orders.js'
import { createError } from '../helpers/createError.js';


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
export async function createUserOrder(req, res, next) {
    try {
        const { items, shippingInfo, amount, isCod } = req.body;

        const formattedItems = items.map(i => ({
            productId: i.productId,
            quantity: i.quantity || 1,
        }))

        const order = await createOrder({
            userId: req.user.id,
            items: formattedItems,
            shippingInfo,
            amount,
            isCod,
            status: 'pending',
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
            .populate('items.productId', 'name price images id status orderId paidAt')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        next(error);
    }
}

// List all orders (admin only)
export async function listOrders(req, res, next) {
    try {
        // Query parameters for filtering
        const { search } = req.query;

        // Build filter object
        const filter = {};

        if (search) {
            filter.$or = [
                { orderId: { $regex: search, $options: 'i' } },
                { 'shippingInfo.email': { $regex: search, $options: 'i' } },
                { 'shippingInfo.firstName': { $regex: search, $options: 'i' } },
                { 'shippingInfo.lastName': { $regex: search, $options: 'i' } }
            ];
        }

        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        const orders = await Order.find(filter)
            .populate('userId', 'name email')
            .populate('items.productId', 'name price images')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Order.countDocuments(filter);

        res.status(200).json({
            success: true,
            count: orders.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            data: orders
        });
    } catch (error) {
        next(error);
    }
}

// Get a single order by ID (admin)
export async function getOrder(req, res, next) {
    try {
        const order = await Order.findById(req.params.id)
            .populate('userId', 'name email')
            .populate('items.productId', 'name price images');

        if (!order) {
            return next(createError(404, 'Order not found'));
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
}

export async function create(req, res, next) {
    try {
        // Validate required fields
        const { userId, items, amount } = req.body;

        if (!userId || !items || !amount) {
            return next(createError(400, 'Please provide all required fields'));
        }

        // Create order
        const order = await Order.create(req.body);

        res.status(201).json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
}

export async function updateOrder(req, res, next) {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('userId', 'name email')
            .populate('items.productId', 'name price images');

        if (!order) {
            return next(createError(404, 'Order not found'));
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
}

export async function updateOrderStatus(req, res, next) {
    try {
        const { status } = req.body;

        if (!status) {
            return next(createError(400, 'Status is required'));
        }

        // Validate status
        const validStatuses = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return next(createError(400, 'Invalid status value'));
        }

        // Update fields based on status
        const updateData = { status };

        // If status is paid, set paidAt
        if (status === 'paid') {
            updateData.paidAt = Date.now();
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).populate('userId', 'name email')
            .populate('items.productId', 'name price image');

        if (!order) {
            return next(createError(404, 'Order not found'));
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
}

export async function deleteOrder(req, res, next) {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);

        if (!order) {
            return next(createError(404, 'Order not found'));
        }

        res.status(200).json({
            success: true,
            message: 'Order deleted successfully'
        });
    } catch (error) {
        next(error);
    }
}

export async function statsOrder(req, res, next) {
    try {
        // Get total orders
        const totalOrders = await Order.countDocuments();

        // Get orders by status
        const pendingOrders = await Order.countDocuments({ status: 'pending' });
        const paidOrders = await Order.countDocuments({ status: 'paid' });
        const shippedOrders = await Order.countDocuments({ status: 'shipped' });
        const deliveredOrders = await Order.countDocuments({ status: 'delivered' });
        const cancelledOrders = await Order.countDocuments({ status: 'cancelled' });

        // Get total revenue
        const revenueResult = await Order.aggregate([
            {
                $match: {
                    status: { $in: ['paid', 'shipped', 'delivered'] }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ]);

        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        // Get recent orders
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('userId', 'name email');

        res.status(200).json({
            success: true,
            data: {
                totalOrders,
                ordersByStatus: {
                    pending: pendingOrders,
                    paid: paidOrders,
                    shipped: shippedOrders,
                    delivered: deliveredOrders,
                    cancelled: cancelledOrders
                },
                totalRevenue,
                recentOrders
            }
        });
    } catch (error) {
        next(error);
    }
}
