'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Heritages', {
            id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
            alias: { type: Sequelize.STRING, allowNull: false, unique: true },
            name: { type: Sequelize.STRING, allowNull: false },
            cat: { type: Sequelize.STRING },
            loc: { type: Sequelize.STRING },
            lat: { type: Sequelize.FLOAT },
            lng: { type: Sequelize.FLOAT },
            desc: { type: Sequelize.TEXT },
            img: { type: Sequelize.STRING },
            createdAt: { type: Sequelize.DATE, allowNull: false },
            updatedAt: { type: Sequelize.DATE, allowNull: false }
        });
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable('Heritages');
    }
};