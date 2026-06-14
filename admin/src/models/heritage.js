const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Heritage = sequelize.define('Heritage', {
    alias: { type: DataTypes.STRING, unique: true },
    name: { type: DataTypes.STRING },
    cat: { type: DataTypes.STRING },
    loc: { type: DataTypes.STRING },
    lat: { type: DataTypes.FLOAT },
    lng: { type: DataTypes.FLOAT },
    desc: { type: DataTypes.TEXT },
    img: { type: DataTypes.STRING }
});

module.exports = Heritage;