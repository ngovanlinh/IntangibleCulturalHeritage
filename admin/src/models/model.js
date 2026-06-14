const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Model = sequelize.define('Model', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    path: { type: DataTypes.STRING, allowNull: false },
    image: { type: DataTypes.STRING },
    desc: { type: DataTypes.TEXT }
});

module.exports = Model;