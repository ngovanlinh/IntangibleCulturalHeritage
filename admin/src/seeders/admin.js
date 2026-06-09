const bcrypt = require('bcryptjs');
const { User } = require('../models');

const createAdmin = async () => {
    try {
        const hashedPassword = await bcrypt.hash('admin123', 10); // Mật khẩu mặc định: admin123

        await User.findOrCreate({
            where: { username: 'admin' },
            defaults: {
                password: hashedPassword,
                role: 'admin'
            }
        });

        console.log('✅ Tài khoản Admin đã được tạo thành công!');
    } catch (error) {
        console.error('❌ Lỗi khi tạo Admin:', error);
    } finally {
        process.exit();
    }
};

createAdmin();