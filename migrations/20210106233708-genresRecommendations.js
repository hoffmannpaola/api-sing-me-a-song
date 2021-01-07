'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('genresRecommendations', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      recommendationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'recommendations',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'

      },
      genresId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'genres',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      }
    });
  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.dropTable('genresRecommendations');
    
  }
};
