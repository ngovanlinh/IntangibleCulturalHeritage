'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Videos', {
            id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
            title: { type: Sequelize.STRING },
            url: { type: Sequelize.STRING, allowNull: false },
            thumbnail: { type: Sequelize.STRING },
            heritageId: {
                type: Sequelize.INTEGER,
                references: { model: 'Heritages', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            createdAt: { type: Sequelize.DATE, allowNull: false },
            updatedAt: { type: Sequelize.DATE, allowNull: false }
        });
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable('Videos');
    }
};