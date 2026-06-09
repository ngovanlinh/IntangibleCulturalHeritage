const express = require('express');
const router = express.Router();
const heritageController = require('../controllers/heritageController');

// Đường dẫn: GET /api/heritages
router.get('/', heritageController.getAllHeritages);

// Đường dẫn: POST /api/heritages
router.post('/', heritageController.createHeritage);

module.exports = router;