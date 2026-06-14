'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Events', {
            id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
            name: { type: Sequelize.STRING, allowNull: false },
            date: { type: Sequelize.STRING },
            loc: { type: Sequelize.STRING },
            status: { type: Sequelize.STRING },
            createdAt: { type: Sequelize.DATE, allowNull: false },
            updatedAt: { type: Sequelize.DATE, allowNull: false }
        });
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable('Events');
    }
};