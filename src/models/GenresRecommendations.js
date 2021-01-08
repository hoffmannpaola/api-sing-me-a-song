const { Sequelize } = require('sequelize');
const sequelize = require('../utils/database');

class GenresRecommendations extends Sequelize.Model {

}

GenresRecommendations.init({
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
}, {
    sequelize,
    timestamps: false,
    modelName: 'genresRecommendations'
});

module.exports = GenresRecommendations;