const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const webScrapController = require("../controllers/webscrapper");
const { ensureAuth } = require("../middleware/auth");

//Post Routes
//Since linked from server js treat each path as:
//post/:id, post/createPost, post/likePost/:id, post/deletePost/:id
router.get("/season", webScrapController.getSeason);
router.get("/currentWeek", webScrapController.getCurrentWeek);
router.get("/season/week/:id", webScrapController.getWeek);


module.exports = router;
