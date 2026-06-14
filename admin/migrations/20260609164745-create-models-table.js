'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Models', {
            id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
            name: { type: Sequelize.STRING, allowNull: false },
            path: { type: Sequelize.STRING, allowNull: false },
            image: { type: Sequelize.STRING },
            desc: { type: Sequelize.TEXT },
            createdAt: { type: Sequelize.DATE, allowNull: false },
            updatedAt: { type: Sequelize.DATE, allowNull: false }
        });
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable('Models');
    }
};