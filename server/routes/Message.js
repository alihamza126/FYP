import express from 'express';
import Message from '../models/Message.js';

const messageRouter = express.Router();

messageRouter.get(
    '/msg/:user1/:user2',
    async (req, res) => {
        const { user1, user2 } = req.params;
        try {
            const messages = await Message.find({
                $or: [
                    { senderId: user1, receiverId: user2 },
                    { senderId: user2, receiverId: user1 }
                ]
            }).sort('createdAt');
            res.json(messages);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    }
);

//    — save a new message
messageRouter.post(
    '/',
    async (req, res) => {
        const { senderId, receiverId, text } = req.body;
        if (!senderId || !receiverId || !text) {
            return res.status(400).json({ error: 'senderId, receiverId and text are required' });
        }
        try {
            const message = await Message.create({ senderId, receiverId, text });
            res.status(201).json(message);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    }
);

export default messageRouter;
