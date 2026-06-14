const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    username: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['admin', 'editor']] // Sequelize sẽ tự kiểm tra dữ liệu trước khi lưu
        }
    }
});

module.exports = User;