const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_SERVER,
        port: parseInt(process.env.DB_PORT, 10) || 1433, // Đã được ép kiểu sang dạng số
        dialect: 'mssql',
        dialectModule: require('tedious'),
        dialectOptions: {
            options: {
                encrypt: true,
                trustServerCertificate: true
            }
        },
        logging: false
    }
);

module.exports = sequelize;