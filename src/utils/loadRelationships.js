const Genre = require('../models/Genre');
const Recommendation = require('../models/Recommendation');
const GenresRecommendations = require('../models/GenresRecommendations');

Recommendation.belongsToMany(Genre, { through: GenresRecommendations, foreignKey: 'recommendationId', otherKey: 'genresId' });

Genre.belongsToMany(Recommendation, { through: GenresRecommendations, foreignKey: 'genresId', otherKey: 'recommendationId' });