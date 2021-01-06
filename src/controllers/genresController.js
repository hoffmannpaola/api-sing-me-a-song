

class GenresController {
  async create(req, res) {
    try {
     
    } catch (err) {
      console.error(err);
      return res.sendStatus(500);
    }
  }

  async getAll(req, res) {
    try {
        res.send("deu certo").status(201);
      
    } catch (err) {
      console.error(err);
      return res.sendStatus(500);
    }
  }

  async getOne(req, res) {
    try {
      
    } catch (err) {

      console.error(err);
      return res.sendStatus(500);
    }
  }
}

module.exports = new GenresController();