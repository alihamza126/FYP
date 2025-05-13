import express from 'express'
import { asyncWrapper } from '../helpers/asyncWrapper.js';
import { authenticateJWT } from '../middleware/JwtAthenticate.js';
import { listAddresses, createAddress, updateAddress, deleteAddress } from '../controllers/address.controller.js'


const addressRouter = express.Router();

addressRouter.use(authenticateJWT)         // all `/api/addresses` routes need auth
addressRouter.get('/', listAddresses)
addressRouter.post('/', createAddress)
addressRouter.patch('/:id', updateAddress)
addressRouter.delete('/:id', deleteAddress)





export default addressRouter;
