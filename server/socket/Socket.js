import express from 'express';
const app = express();
import { Server } from 'socket.io';
import Message from '../models/Message.js';
import User from '../models/User.js';


let activeUsers = [];
let adminUsers = [];

const setupSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: '*',  // You can restrict this to your frontend origin for security purposes
            methods: ['GET', 'POST'],
        }
    });

    io.on('connection', async (socket) => {
        const { userId: newUserId } = socket.handshake.auth;
        if (!newUserId) return

        const isAdmin = await User.exists({ _id: newUserId, role: 'admin' });

        if (isAdmin) {
            console.log(`User ${newUserId} connected as admin`);
            adminUsers.push({ userId: newUserId, socketId: socket.id });
        } else {
            console.log(`User ${newUserId} connected as customer`);
            activeUsers.push({ userId: newUserId, socketId: socket.id });
        }

        // 1) track active user
        if (!activeUsers.some(u => u.userId === newUserId)) {
            activeUsers.push({ userId: newUserId, socketId: socket.id });
        }
        io.emit('active-users', activeUsers);

        // 2) load & send all previous messages involving this user
        try {
            const previous = await Message.find({
                $or: [
                    { senderId: newUserId },
                    { receiverId: newUserId }
                ]
            }).sort('createdAt');
            socket.emit('previous-messages', previous);
        } catch (err) {
            console.error('Error loading previous messages:', err);
        }

        socket.on('seleted-user-messages', async ({ senderId }) => {
            console.log("adminn reqestt for this", senderId)
            const previous = await Message.find({ senderId: senderId }).sort('createdAt');
            console.log("previous message", previous);
            socket.emit('seleted-user-messages', previous);
        })

        // 3) handle incoming chat messages
        socket.on('send-message', async (data) => {
            const { sender, id, text } = data;
            if (!sender || !text || !id) return;
            console.log("message received", data);

            try {
                const msg = await Message.create({ senderId: sender, text });
                // emit back to sender
                socket.emit('receive-message', msg);
            } catch (err) {
                console.error('Failed to save message:', err);
            }
        });



        //admin receive message
        socket.on('admin-message-sent', async (data) => {
            const { sender, id, text, receiver } = data;
            if (!sender || !text || !id) return;
            console.log("admin message received", data);

            try {
                const msg = await Message.create({ senderId: receiver, text, from: "admin" });
                if (!msg) return;
                // emit to receiver
                const receiverSocket = activeUsers.find(u => u.userId === receiver);
                if (receiverSocket) {
                    console.log("send to user reciver", receiverSocket);
                    io.to(receiverSocket.socketId).emit('receive-message', msg);
                }
                // emit back to sender
                // socket.emit('receive-message', msg);
            } catch (err) {
                console.error('Failed to save message:', err);
            }
        });

        // 4) clean up on disconnect
        socket.on('disconnect', () => {
            activeUsers = activeUsers.filter(u => u.socketId !== socket.id);
            io.emit('active-users', activeUsers);
        });
    });
};


export default setupSocket; //export is here