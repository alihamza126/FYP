import express from 'express'
import { asyncWrapper } from '../helpers/asyncWrapper.js';
import {
    listUsers,
    getUser,
    updateUser,
    deleteUser,
  } from '../controllers/adminUser.controller.js';

const adminRouter = express.Router();


// CRUD for users
adminRouter.get('/users', listUsers)
adminRouter.get('/users/:id', getUser)
adminRouter.put('/users/:id', updateUser)
adminRouter.delete('/users/:id', deleteUser)





export default adminRouter;
