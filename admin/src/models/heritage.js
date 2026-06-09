const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Heritage = sequelize.define('Heritage', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    alias: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Đảm bảo không có 2 di sản trùng đường dẫn
        comment: 'Đường dẫn tĩnh (vd: nghe-lam-banh-trang)'
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Tên di sản'
    },
    cat: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Danh mục di sản'
    },
    loc: {
        type: DataTypes.STRING,
        comment: 'Địa điểm'
    },
    desc: {
        type: DataTypes.TEXT,
        comment: 'Mô tả ngắn hiển thị ở thẻ 3D'
    },
    history: {
        type: DataTypes.TEXT,
        comment: 'Nội dung bài viết chi tiết (chứa HTML từ Rich Text Editor)'
    },
    lat: {
        type: DataTypes.FLOAT,
        comment: 'Vĩ độ bản đồ'
    },
    lng: {
        type: DataTypes.FLOAT,
        comment: 'Kinh độ bản đồ'
    },
    img: {
        type: DataTypes.STRING,
        comment: 'Đường dẫn ảnh bìa'
    }
}, {
    tableName: 'Heritages',
    timestamps: true // Tự động tạo 2 cột rất hữu ích: createdAt (ngày tạo) và updatedAt (ngày sửa)
});

module.exports = Heritage;