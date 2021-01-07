const express = require('express');

const router = express.Router();

const recommendationsController = require('../controllers/recommendationsController');

router.post("/", recommendationsController.postRecommendation );
router.get("/" );
router.get("/:id" );

module.exports = router;