// src/controllers/authController.js
const { User } = require('../models'); // Kiểm tra file models/index.js phải export User
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Kiểm tra xem User có tồn tại không
        const user = await User.findOne({ where: { username } });

        const test = await bcrypt.compare('1', user.password);

        const isMatch = await bcrypt.compare(password, user.password);

        if (!user || !isMatch) {
            return res.status(401).json({ message: 'Sai tên đăng nhập hoặc mật khẩu' });
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
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Tách lấy phần token sau chữ "Bearer"

    if (!token) return res.status(403).json({ message: 'Chưa cung cấp token!' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Token không hợp lệ!' });
        req.user = decoded;
        next();
    });
};

module.exports = { login, verifyToken };