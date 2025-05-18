import express from 'express';
import { authenticateUser } from '../middleware/auth.middleware.js';
import Order from '../models/orders.js'
import Review from '../models/review.js'
import Product from '../models/product.js';



const reviewRouter = express.Router();


reviewRouter.get('/', async (req, res) => {
    try {
        const reviews = await Review
            .find()                         // all reviews
            .sort('-createdAt')             // newest first
            .populate({                     // only username & image from User
                path: 'user',
                select: 'username image'
            }).select('order rating comment createdAt');

        return res.status(200).json({ reviews });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});


reviewRouter.use(authenticateUser);

reviewRouter.post('/:orderId', async (req, res) => {
    try {
        const userId = req.user.id;
        const { orderId } = req.params;
        const { productId, rating, comment, imageUrls } = req.body;

        // 1) Find the order
        const order = await Order.findOne({ orderId: orderId, userId: userId });
        // console.log(order);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        if (!order.status === 'delivered') {
            return res.status(400).json({ message: 'Cannot review before delivery.' });
        }

        // 2) Check that product was in the order
        const inOrder = order.items.some(item => item.productId.toString() == productId);
        if (!inOrder) {
            return res.status(400).json({ message: 'Product not part of this order.' });
        }

        const existing = await Review.findOne({ order: order._id, product: productId, user: userId });
        if (existing) {
            return res.status(400).json({ message: 'You have already reviewed this item.' });
        }

        // 5) Create review
        const review = await Review.create({
            user: userId,
            order: order._id,
            product: productId,
            rating: Number(rating),
            comment: comment || '',
            images: imageUrls
        });

        // 6) Update product stats
        const product = await Product.findById(productId);
        product.reviews.push(review._id);
        product.numReviews = product.reviews.length;
        // recalc averageRating
        const allReviews = await Review.find({ product: productId });
        const sum = allReviews.reduce((acc, r) => acc + r.rating, 0);
        product.averageRating = sum / allReviews.length;
        await product.save();

        res.status(201).json({ review });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}
);

reviewRouter.get('/:orderId', async (req, res) => {
    try {
        const userId = req.user.id;
        const { orderId } = req.params;

        // 1) load the order with populated products
        const order = await Order
            .findOne({ orderId: orderId, userId: userId })
            .populate('items.productId');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // 2) fetch all reviews this user has made on this order
        const userReviews = await Review
            .find({ order: order._id, user: userId })
            .select('product').populate('product user');
        const reviewedProductIds = new Set(
            userReviews.map(r => r.product.toString())
        );

        // 3) filter items to only those not yet reviewed
        const itemsToReview = order.items.filter(item =>
            !reviewedProductIds.has(item.productId._id.toString())
        );

        // 4) return back only the un-reviewed items
        return res.status(200).json({
            order: {
                _id: order._id,
                orderId: order.orderId,
                status: order.status,
                deliveredAt: order.deliveredAt,
                items: itemsToReview
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});





export default reviewRouter;