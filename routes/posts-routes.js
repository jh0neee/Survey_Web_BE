const express = require("express");

const postsControllers = require('../controllers/posts-controller');

const router = express.Router();

router.get('/:pid', postsControllers.getPostById);

router.get('/user/:uid', postsControllers.getPostsByUserId);

router.post('/', postsControllers.createPost);

router.patch('/:pid', postsControllers.updatePost);

router.delete('/:pid', postsControllers.deledeletePost);

module.exports = router;
