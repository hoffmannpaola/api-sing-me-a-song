const express = require('express');

const router = express.Router();

const genresController = require('../controllers/genresController');

router.post("/");
router.get("/", genresController.getAll);


module.exports = router;