const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const leagueController = require("../controllers/league");

//Post Routes
//Since linked from server js treat each path as:
//post/:id, post/createPost, post/likePost/:id, post/deletePost/:id
router.post("/createLeague", leagueController.createLeague);

module.exports = router;
