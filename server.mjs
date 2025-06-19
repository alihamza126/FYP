import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import express from 'express'
import userRouter from './server/routes/users.js';
// import errorHandler from './server/middleware/errorHandler.js';
import mongoose from 'mongoose';

import dotenv from "dotenv";
import addressRouter from './server/routes/address.js';
import cookieParser from 'cookie-parser';
import categoryRouter from './server/routes/category.js';
import adminRouter from './server/routes/Admin.js';
import productRouter from './server/routes/product.js';
import sliderRouter from './server/routes/slider.js';
import paymentRouter from './server/routes/payment.js';
import ordersRouter from './server/routes/orders.js';
import reviewRouter from './server/routes/review.js';
import setupSocket from './server/socket/Socket.js';
import messageRouter from './server/routes/Message.js';
import aiRouter from './server/routes/ai.js';
dotenv.config({
  path: "./.env.local",
}); // 👈 



const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handler = app.getRequestHandler()
const expressApp = express();



const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

connectMongoDB();



app.prepare().then(() => {



  expressApp.use(cookieParser());
  expressApp.use("/api/v1/payment", paymentRouter);
  expressApp.use(express.json());

  //routes start from here
  expressApp.use("/api/v1/users", userRouter);
  expressApp.use("/api/v1/superadmin", adminRouter); //for superadmin
  expressApp.use("/api/v1/address", addressRouter);
  expressApp.use("/api/v1/category", categoryRouter);
  expressApp.use("/api/v1/product", productRouter);
  expressApp.use("/api/v1/slider", sliderRouter);
  expressApp.use("/api/v1/orders", ordersRouter);
  expressApp.use("/api/v1/review", reviewRouter);
  expressApp.use('/api/v1/messages', messageRouter);

  expressApp.use('/api/v1/ai', aiRouter);






  // for next front-end requests
  expressApp.use((req, res) => {
    const parsedUrl = parse(req.url, true)
    handler(req, res, parsedUrl)
  });

  // error handler middleware
  // expressApp.use(errorHandler);

  const httpServer = createServer(expressApp);
  setupSocket(httpServer);



  httpServer.listen(port, () => {
    console.log(
      `> Server listening at http://localhost:${port} as ${dev ? 'development' : process.env.NODE_ENV
      }`
    )
  })
})
