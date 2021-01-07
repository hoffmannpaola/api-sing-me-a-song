'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('recommendations', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      genresIds: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      youtubeLink: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      score: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });
    
  },

  down: async (queryInterface, Sequelize) => {
   
    await queryInterface.dropTable('recommendations');
    
  }
};
