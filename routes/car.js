const express = require('express')
const { 
    getCars,
    getCarById,
    addCar,
    updateCar,
    deleteCar,
} = require('../controllers/car')
const { protect, admin } = require('../middleware/authMiddleware')
const { uploadImage } = require('../utils/cloudinary')
const upload = require('../middleware/multer')

const router = express.Router()

router.get('/getcars', getCars)
router.post('/:id', getCarById)

router.post('/', protect, admin, upload.single('image'), async (req,res) => {
    try {
        let imageUrl = ""
        if(req.file){
            imageUrl = await uploadImage(req.file.buffer)
        }

        req.body.image = imageUrl
        addCar(req,res)
    } catch (error) {
        return res.status(500).json({ message: 'Error uploading image', error })
    }
})

router.put('/:id', protect, admin, upload.single('image'), async (req,res) => {
    try {
        const updatedData = req.body

        if(req.file){
            updatedData.image = await uploadImage(req.file.buffer)
        }

        req.body = updatedData
        updateCar(req,res)
    } catch (error) {
        return res.status(500).json({ message: 'Error updating car image', error })
    }
})

router.delete('/:id', protect, admin, deleteCar)

module.exports = router