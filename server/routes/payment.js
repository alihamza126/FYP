import express from "express"
import Stripe from "stripe";
import dotenv from "dotenv";
import { authenticateUser, isAdmin } from '../middleware/auth.middleware.js';
import { createOrder } from "../controllers/order.controller.js";

dotenv.config({
    path: "./.env.local",
});

const paymentRouter = express.Router()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2023-10-16",
});



// Create PaymentIntent
paymentRouter.post("/create-payment", express.json(), authenticateUser, async (req, res) => {
    try {
        const { amount, currency = "usd", cartArray, shippingInfo } = req.body

        if (!amount || typeof amount !== "number") {
            return res.status(400).json({ error: "Invalid amount" })
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: parseInt(amount * 100), // cents
            currency,
            payment_method_types: ["card"],
            metadata: {
                userId: req.user.id,
                cartArray: JSON.stringify(cartArray),
                shippingInfo: JSON.stringify(shippingInfo)
            },
        })
        res.status(200).json({ clientSecret: paymentIntent.client_secret, success: true })
    } catch (error) {
        console.error("Stripe error:", error.message)
        res.status(500).json({ error: "Failed to create payment intent" })
    }
});


paymentRouter.post('/webhook', express.raw({ type: 'application/json' }), async (request, response) => {
    const sig = request.headers['stripe-signature'];
    const endpointSecret = "whsec_sCavULJzL81ItnTWM2jf8etI8pDVK8Tn";



    let event;
    try {
        event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
        console.log(err)
        return response.status(400).send(`Webhook Error: ${err.message}`);
    }


    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        const connectedAccountId = event.account;

        const shippingInfo = JSON.parse(paymentIntent.metadata.shippingInfo)
        const cartArray = JSON.parse(paymentIntent.metadata.cartArray);

        await createOrder({
            userId: paymentIntent.metadata.userId,
            items: cartArray,
            shippingInfo,
            paymentIntentId: paymentIntent.id,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            status: "paid"
        })
    }

    response.json({ received: true });
});




export default paymentRouter
