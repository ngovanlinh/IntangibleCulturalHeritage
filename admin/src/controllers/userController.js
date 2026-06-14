const { User } = require('../models');
const bcrypt = require('bcryptjs');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({ attributes: { exclude: ['password'] } });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        await user.destroy();
        res.json({ message: 'Đã xóa thành viên thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Thêm thành viên mới
exports.createUser = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, password: hashedPassword, role });
        res.status(201).json({ message: 'Tạo tài khoản thành công', user: newUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật thông tin thành viên
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body; // Chỉ cho phép đổi role
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

        user.role = role;
        await user.save();
        res.json({ message: 'Cập nhật thành công', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.changePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { newPassword } = req.body;

        // 1. Mã hóa mật khẩu mới
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // 2. Cập nhật vào DB
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

        user.password = hashedPassword;
        await user.save();

        res.json({ message: 'Đổi mật khẩu thành công!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};