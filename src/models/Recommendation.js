const { Sequelize } = require('sequelize');
const sequelize = require('../utils/database');

class Recommendation extends Sequelize.Model {

}

Recommendation.init({
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
    }
}, {
    sequelize,
    timestamps: false,
    modelName: 'recommendations'
});

module.exports = Recommendation;