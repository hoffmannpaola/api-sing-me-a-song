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
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: false,
    },
    youtubeLink: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    score: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
}, {
    sequelize,
    timestamps: false,
    modelName: 'recommendations'
});

module.exports = Recommendation;