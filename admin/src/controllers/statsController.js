const { Heritage, Video, Gallery, User, Model, sequelize } = require('../models');

exports.getStats = async (req, res) => {
    try {
        console.log("--- BẮT ĐẦU THỐNG KÊ ---");

        // 1. Đếm tổng số lượng các thực thể
        const [totalHeritages, totalVideos, totalGalleries, totalUsers, totalModels] = await Promise.all([
            Heritage.count().catch(() => 0),
            Video.count().catch(() => 0),
            Gallery.count().catch(() => 0),
            User.count().catch(() => 0),
            Model.count().catch(() => 0)
        ]);

        // 2. Thống kê cơ cấu danh mục (cat)
        const categoryStatsRaw = await Heritage.findAll({
            attributes: ['cat', [sequelize.fn('COUNT', sequelize.col('cat')), 'count']],
            group: ['cat']
        });

        const categoryStats = categoryStatsRaw.map(item => ({
            name: item.cat || 'Khác',
            value: parseInt(item.getDataValue('count'))
        }));

        // 3. Thống kê mật độ di sản theo địa phương (loc)
        const locStatsRaw = await Heritage.findAll({ attributes: ['loc'] });
        const locStatsMap = {};

        locStatsRaw.forEach(item => {
            if (item.loc) {
                // Lấy phần trước dấu phẩy và loại bỏ khoảng trắng thừa
                const location = item.loc.split(',')[0].trim();
                locStatsMap[location] = (locStatsMap[location] || 0) + 1;
            }
        });

        const locStats = Object.keys(locStatsMap).map(key => ({
            name: key,
            value: locStatsMap[key]
        }));

        console.log("--- THỐNG KÊ HOÀN TẤT ---");

        // Trả về dữ liệu đầy đủ cho Dashboard
        res.json({
            cards: {
                totalHeritages,
                totalMedia: totalVideos + totalGalleries,
                totalUsers,
                totalModels
            },
            categoryStats,
            locStats
        });

    } catch (error) {
        console.error("❌ LỖI CHI TIẾT:", error);
        res.status(500).json({ message: "Lỗi máy chủ khi lấy dữ liệu thống kê" });
    }
};