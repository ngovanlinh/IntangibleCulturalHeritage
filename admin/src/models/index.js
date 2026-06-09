const sequelize = require('../config/database');
const Heritage = require('./heritage');
const User = require('./user');

module.exports = {
    sequelize,
    Heritage,
    User
};