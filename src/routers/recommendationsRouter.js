const express = require('express');

const router = express.Router();

const recommendationsController = require('../controllers/recommendationsController');

router.post("/", recommendationsController.postRecommendation );
router.post("/:id/upvote", recommendationsController.upVote);
router.post("/:id/downvote", recommendationsController.downVote);
router.get("/:id" );

module.exports = router;