const { Gallery, Video } = require('../models');

const addGallery = async (req, res) => {
    try {
        const item = await Gallery.create(req.body); // req.body phải chứa heritageId
        res.status(201).json(item);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const addVideo = async (req, res) => {
    try {
        const item = await Video.create(req.body); // req.body phải chứa heritageId
        res.status(201).json(item);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { addGallery, addVideo };