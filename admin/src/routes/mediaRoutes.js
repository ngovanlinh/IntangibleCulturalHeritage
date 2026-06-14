const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');

router.post('/gallery', mediaController.addGallery);
router.post('/video', mediaController.addVideo);

module.exports = router;