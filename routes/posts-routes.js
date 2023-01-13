const express = require("express");

const postsControllers = require('../controllers/posts-controller');

const router = express.Router();

// 모든 게시글 목록 검색
router.get('/', postsControllers.getPost);

// 게시글 id로 특정 게시글 검색
router.get('/:pid', postsControllers.getPostById);

// 사용자 id에 대한 모든 게시글 목록 검색
router.get('/user/:uid', postsControllers.getPostsByUserId);

// 새로운 게시글 생성
router.post('/', postsControllers.createPost);

// post id로 게시글 업데이트
router.patch('/:pid', postsControllers.updatePost);

// post id로 게시글 삭제
router.delete('/:pid', postsControllers.deledeletePost);

module.exports = router;
