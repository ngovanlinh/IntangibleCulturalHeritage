// src/controllers/authController.js
const { User } = require('../models'); // Kiểm tra file models/index.js phải export User
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Kiểm tra xem User có tồn tại không
        const user = await User.findOne({ where: { username } });

        if (!user) {
            return res.status(401).json({ message: 'Tên đăng nhập không tồn tại!' });
        }

        // Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Mật khẩu không đúng!' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || 'secret_key',
            { expiresIn: '24h' }
        );

        res.json({ token, role: user.role, message: 'Đăng nhập thành công!' });
    } catch (error) {
        console.error('Chi tiết lỗi:', error); // Log lỗi ra terminal để bắt bệnh
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

module.exports = { login };