const { Sequelize } = require('sequelize');
const sequelize = require('../utils/database');

class Genre extends Sequelize.Model {

}

Genre.init({
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
}, {
    sequelize,
    timestamps: false,
    modelName: 'genres'
});

module.exports = Genre;