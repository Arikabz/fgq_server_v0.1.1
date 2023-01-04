const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const usersController = require("../controllers/users");

//Post Routes
//Since linked from server js treat each path as:
//post/:id, post/createPost, post/likePost/:id, post/deletePost/:id
router.get("/:email", usersController.checkUser );
router.get("/email/", usersController.checkUser );
router.post("/edit/:email", usersController.checkUser);

module.exports = router;
