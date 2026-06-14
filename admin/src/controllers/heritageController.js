const { Heritage, Gallery, Video } = require('../models');

// Lấy danh sách di sản kèm dữ liệu liên quan
const getAllHeritages = async (req, res) => {
    try {
        const data = await Heritage.findAll({
            include: [
                { model: Gallery, as: 'galleries' },
                { model: Video, as: 'videos' }
            ]
        });
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Tạo mới di sản (kèm ảnh và video con)
const createHeritage = async (req, res) => {
    try {
        // req.body dự kiến chứa thông tin Heritage và mảng galleries, videos
        const newHeritage = await Heritage.create(req.body, {
            include: [
                { model: Gallery, as: 'galleries' },
                { model: Video, as: 'videos' }
            ]
        });
        res.status(201).json(newHeritage);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Xóa di sản (kèm dữ liệu con nếu đã thiết lập onDelete: CASCADE)
const deleteHeritage = async (req, res) => {
    try {
        const deleted = await Heritage.destroy({ where: { id: req.params.id } });
        if (deleted) {
            res.json({ message: "Xóa thành công!" });
        } else {
            res.status(404).json({ message: "Không tìm thấy di sản" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getHeritageById = async (req, res) => {
    try {
        const { id } = req.params;
        const heritage = await Heritage.findByPk(id, {
            include: [
                { model: Video, as: 'videos' },
                { model: Gallery, as: 'galleries' }
            ]
        });

        if (!heritage) {
            return res.status(404).json({ message: "Không tìm thấy di sản này" });
        }

        res.json(heritage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateHeritage = async (req, res) => {
    const { id } = req.params;
    const { videos, galleries, ...heritageData } = req.body;
    const t = await sequelize.transaction();

    try {
        // 1. Cập nhật thông tin chính của Heritage
        const heritage = await Heritage.findByPk(id);
        if (!heritage) {
            await t.rollback();
            return res.status(404).json({ message: "Không tìm thấy di sản" });
        }
        await heritage.update(heritageData, { transaction: t });

        // 2. Xóa dữ liệu con cũ (Videos & Galleries liên quan đến di sản này)
        await Video.destroy({ where: { heritageId: id }, transaction: t });
        await Gallery.destroy({ where: { heritageId: id }, transaction: t });

        // 3. Nạp dữ liệu con mới vào
        if (videos?.length) {
            await Video.bulkCreate(videos.map(v => ({ ...v, heritageId: id })), { transaction: t });
        }
        if (galleries?.length) {
            await Gallery.bulkCreate(galleries.map(g => ({ ...g, heritageId: id })), { transaction: t });
        }

        await t.commit();
        res.status(200).json({ message: "Cập nhật thành công!" });
    } catch (error) {
        await t.rollback();
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllHeritages, createHeritage, deleteHeritage, updateHeritage, getHeritageById };