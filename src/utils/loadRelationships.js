const Genre = require('../models/Genre');
const Recommendation = require('../models/Recommendation');

Recommendation.hasMany(Genre);