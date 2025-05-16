import express from 'express';
import { authenticateUser, isAdmin } from '../middleware/auth.middleware.js';

import { create, createUserOrder, deleteOrder, getMyOrders, getOrder, listOrders, statsOrder, updateOrder, updateOrderStatus } from '../controllers/order.controller.js';

const ordersRouter = express.Router();


ordersRouter.get('/me', authenticateUser, getMyOrders);
ordersRouter.post('/place', authenticateUser, createUserOrder);


//forr admin middlleware
ordersRouter.use(authenticateUser);
ordersRouter.use(isAdmin);

ordersRouter.get('/', listOrders);
ordersRouter.get('/:id', getOrder);
ordersRouter.post('/', create);
ordersRouter.put('/:id', updateOrder);
ordersRouter.patch('/status/:id', updateOrderStatus);
ordersRouter.delete('/:id', deleteOrder);
ordersRouter.get('/stats/summary', statsOrder);



export default ordersRouter;