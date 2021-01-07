const joi = require('joi');

const postGenre = joi.object({
    name: joi.string().required()
});

module.exports = {
    postGenre
}