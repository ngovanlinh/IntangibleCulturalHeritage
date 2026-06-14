'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Galleries', {
            id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
            url: { type: Sequelize.STRING, allowNull: false },
            caption: { type: Sequelize.STRING },
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
        await queryInterface.dropTable('Galleries');
    }
};