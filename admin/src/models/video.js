const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Video = sequelize.define('Video', {
    title: { type: DataTypes.STRING },
    url: { type: DataTypes.STRING, allowNull: false },
    thumbnail: { type: DataTypes.STRING }
});


module.exports = Video;