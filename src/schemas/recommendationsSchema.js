const joi = require('joi');

const postRecommendation = joi.object({
    name: joi.string().required(),
    genresIds: joi.array().items(joi.number()).required(),
    youtubeLink: joi.string().regex(/^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/).required()

});

module.exports = {
    postRecommendation
}