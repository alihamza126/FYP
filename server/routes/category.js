import express from 'express'
import { asyncWrapper } from '../helpers/asyncWrapper.js';
import {
    listCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
} from '../controllers/category.controller.js';


const categoryRouter = express.Router();


categoryRouter.get('/', listCategories)
categoryRouter.get('/:id', getCategory)

categoryRouter.post('/', createCategory)
categoryRouter.put('/:id', updateCategory)
categoryRouter.delete('/:id', deleteCategory)





export default categoryRouter;
