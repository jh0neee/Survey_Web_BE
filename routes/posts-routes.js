const express = require("express");

const postsControllers = require('../controllers/posts-controller');

const router = express.Router();

router.get("/:pid", postsControllers.getPostById);

router.get("/user/:uid", postsControllers.getPostByUserId);

module.exports = router;
