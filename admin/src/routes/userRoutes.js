const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, isAdmin } = require('../middlewares/auth');

// Chỉ Admin mới được quyền xem danh sách và xóa thành viên
router.get('/', verifyToken, isAdmin, userController.getAllUsers);
router.delete('/:id', verifyToken, isAdmin, userController.deleteUser);
router.post('/', verifyToken, isAdmin, userController.createUser);
router.put('/:id', verifyToken, isAdmin, userController.updateUser);
router.put('/:id/password', verifyToken, isAdmin, userController.changePassword);
module.exports = router;