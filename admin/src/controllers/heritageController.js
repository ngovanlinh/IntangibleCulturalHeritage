const { Heritage } = require('../models');

// 1. Lấy danh sách tất cả di sản (GET)
const getAllHeritages = async (req, res) => {
    try {
        const heritages = await Heritage.findAll();
        res.json(heritages); // Trả về dữ liệu chuẩn JSON
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server khi lấy dữ liệu', error: error.message });
    }
};

// 2. Thêm một di sản mới (POST)
const createHeritage = async (req, res) => {
    try {
        // req.body chứa dữ liệu từ form Admin ReactJS gửi lên
        const newHeritage = await Heritage.create(req.body);
        res.status(201).json({ message: 'Thêm di sản thành công!', data: newHeritage });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Lỗi khi thêm di sản', error: error.message });
    }
};

module.exports = {
    getAllHeritages,
    createHeritage
};