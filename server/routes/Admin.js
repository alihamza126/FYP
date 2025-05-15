import express from 'express'
import { asyncWrapper } from '../helpers/asyncWrapper.js';
import {
  listUsers,
  getUser,
  updateUser,
  deleteUser,
  createUser
} from '../controllers/adminUser.controller.js';
import { authenticateUser, isAdmin } from '../middleware/auth.middleware.js';


const adminRouter = express.Router();


adminRouter.use(authenticateUser);
adminRouter.use(isAdmin);

// CRUD for users
adminRouter.get('/users', listUsers)
adminRouter.get('/users/:id', getUser)
adminRouter.put('/users/:id', updateUser)
adminRouter.delete('/users/:id', deleteUser)
adminRouter.post('/users', createUser)





export default adminRouter;
