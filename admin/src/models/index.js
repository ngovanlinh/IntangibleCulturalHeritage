const Heritage = require('./heritage');
const Gallery = require('./gallery');
const Video = require('./video');
const User = require('./user');
const Model = require('./model');

// Thiết lập quan hệ
Heritage.hasMany(Gallery, { foreignKey: 'heritageId', as: 'galleries' });
Gallery.belongsTo(Heritage, { foreignKey: 'heritageId' });

Heritage.hasMany(Video, { foreignKey: 'heritageId', as: 'videos' });
Video.belongsTo(Heritage, { foreignKey: 'heritageId' });

module.exports = { sequelize: require('../config/database'), Heritage, Gallery, Video, User, Model };