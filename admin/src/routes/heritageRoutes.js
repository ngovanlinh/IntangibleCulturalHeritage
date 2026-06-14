const { verifyToken } = require('../middlewares/auth');
const statsController = require('../controllers/statsController');
const express = require('express');
const router = express.Router();
const controller = require('../controllers/heritageController');

router.get('/stats', verifyToken, statsController.getStats);
router.get('/', controller.getAllHeritages);
router.get('/:id', controller.getHeritageById);
router.post('/', controller.createHeritage);
router.delete('/:id', controller.deleteHeritage);

module.exports = router;