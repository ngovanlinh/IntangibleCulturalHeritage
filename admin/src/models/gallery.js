const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Heritage = require('./heritage');

const Gallery = sequelize.define('Gallery', {
    url: { type: DataTypes.STRING, allowNull: false },
    caption: { type: DataTypes.STRING }
});


module.exports = Gallery;