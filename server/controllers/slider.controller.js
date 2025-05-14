import Slider from '../models/Slider.js'


export async function listSliders(req, res, next) {
    try {
        const sliders = await Slider.find().sort('-createdAt')
        res.json({ sliders })
    } catch (err) {
        next(err)
    }
}


export async function getSlider(req, res, next) {
    try {
        const { id } = req.params
        const slider = await Slider.findById(id)
        if (!slider) return res.sendStatus(404)
        res.json({ slider })
    } catch (err) {
        next(err)
    }
}


export async function createSlider(req, res, next) {
    try {
        const data = req.body
        const newSlider = await Slider.create(data)
        res.status(201).json({ slider: newSlider })
    } catch (err) {
        next(err)
    }
}


export async function updateSlider(req, res, next) {
    try {
        const { id } = req.params
        const updated = await Slider.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        )
        if (!updated) return res.sendStatus(404)
        res.json({ slider: updated })
    } catch (err) {
        next(err)
    }
}


export async function deleteSlider(req, res, next) {
    try {
        const { id } = req.params
        const deleted = await Slider.findByIdAndDelete(id)
        if (!deleted) return res.sendStatus(404)
        res.sendStatus(204)
    } catch (err) {
        next(err)
    }
}