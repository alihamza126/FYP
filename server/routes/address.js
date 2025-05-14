import express from 'express'
import { asyncWrapper } from '../helpers/asyncWrapper.js';
import { authenticateUser } from '../middleware/auth.middleware.js';
import { listAddresses, createAddress, updateAddress, deleteAddress } from '../controllers/address.controller.js'


const addressRouter = express.Router();

addressRouter.use(authenticateUser);

addressRouter.get('/', asyncWrapper(listAddresses))
addressRouter.post('/', asyncWrapper(createAddress))
addressRouter.patch('/:id', asyncWrapper(updateAddress))
addressRouter.delete('/:id', asyncWrapper(deleteAddress))





export default addressRouter;
