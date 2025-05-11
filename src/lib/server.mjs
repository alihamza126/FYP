import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import express from 'express'
import userRouter from './server/routes/users.js';
import { errorHandler } from './server/middleware/error.middleware.js';
import mongoose from 'mongoose';

import dotenv from "dotenv";
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
  expressApp.use(express.json());

  //routes start from here
  expressApp.use("/api/v1/users", userRouter);




  // for next front-end requests
  expressApp.use((req, res) => {
    const parsedUrl = parse(req.url, true)
    handler(req, res, parsedUrl)
  });

  // error handler middleware
  expressApp.use(errorHandler);




  createServer(expressApp).listen(port, () => {
    console.log(
      `> Server listening at http://localhost:${port} as ${dev ? 'development' : process.env.NODE_ENV
      }`
    )
  })
})
