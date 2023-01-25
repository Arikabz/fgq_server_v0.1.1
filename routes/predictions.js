const express = require("express");
const router = express.Router();
const predictionsController = require("../controllers/predictions");

//Post Routes
//Since linked from server js treat each path as:
//post/:id, post/createPost, post/likePost/:id, post/deletePost/:id
router.post("/makePredictionTemplate", predictionsController.makePredictionTemplate );

module.exports = router;
