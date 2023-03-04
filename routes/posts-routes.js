const express = require("express");
const { check } = require("express-validator");

const postsControllers = require("../controllers/posts-controller");
const checkAuth = require("../middleware/check-auth");
const router = express.Router();

// 모든 게시글 목록 검색
router.get("/", postsControllers.getPost);

// 게시글 id로 특정 게시글 검색
router.get("/:pid/content", postsControllers.getPostById);

// 아래 route 유효 token 확인
router.use(checkAuth);

// 새로운 게시글 생성
router.post(
  "/",
  [check("title").not().isEmpty(), check("content").isLength({ min: 5 })],
  postsControllers.createPost
);

// post id로 게시글 업데이트
router.patch(
  "/:pid",
  [check("title").not().isEmpty(), check("content").isLength({ min: 5 })],
  postsControllers.updatePost
);

// post id로 게시글 삭제
router.delete("/:pid", postsControllers.deletePost);

module.exports = router;
