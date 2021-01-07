const express = require('express');

const router = express.Router();

const genresController = require('../controllers/genresController');

router.post("/", genresController.create);
router.get("/", genresController.getAll);


module.exports = router;