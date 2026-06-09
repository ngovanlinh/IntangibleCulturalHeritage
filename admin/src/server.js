const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./models');
const heritageRoutes = require('./routes/heritageRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/heritages', heritageRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Chào mừng đến với Hệ thống API Heritage 3D!' });
});

const PORT = process.env.PORT || 5000;

// Khởi động server & Database
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Kết nối Cơ sở dữ liệu SQL Server thành công!');

        await sequelize.sync();
        console.log('📦 Đã đồng bộ cấu trúc bảng thành công!');

        app.listen(PORT, () => {
            console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Kết nối Cơ sở dữ liệu thất bại. Lỗi chi tiết:', error);
    }
};

startServer();