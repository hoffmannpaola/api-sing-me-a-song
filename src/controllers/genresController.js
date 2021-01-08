const genreSchema = require('../schemas/genreSchema');
const Genre = require('../models/Genre');

class GenresController {
  async create(req, res) {

    try {
      const validation = genreSchema.postGenre.validate(req.body);
      if(validation.error) return res.sendStatus(422);

      const { name } = req.body;

      const genre = await Genre.findOne({where: {name} });
      if (genre) return res.sendStatus(409);

      await Genre.create({name});

      res.sendStatus(201);

    } catch (err) {
      console.error(err);
      return res.sendStatus(500);
    }
  }

  async getAll(req, res) {
    try {

      const genres = await Genre.findAll();
      res.send(genres).status(200);
      
    } catch (err) {
      console.error(err);
      return res.sendStatus(500);
    }
  }

}

module.exports = new GenresController();