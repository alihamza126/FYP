import express from 'express'
import {
    listSliders,
    getSlider,
    createSlider,
    updateSlider,
    deleteSlider
} from '../controllers/slider.controller.js'


const sliderRouter = express.Router()


// Public endpoints
sliderRouter.get('/', listSliders)
sliderRouter.get('/:id', getSlider)



// Admin endpoints
sliderRouter.post('/', createSlider)
sliderRouter.put('/:id', updateSlider)
sliderRouter.delete('/:id', deleteSlider)

export default sliderRouter
