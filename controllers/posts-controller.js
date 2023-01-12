const HttpError = require("../models/http-error");

const DUMMY_POSTS = [
  {
    id: "p1",
    title: "만족도 조사",
    createDate: "2022.10.11",
    author: "작성자",
    content: "만족도 조사를 실시합니다.",
    creator: "u1",
  },
];

const getPostById = (req, res, next) => {
  const postId = req.params.pid;
  const post = DUMMY_POSTS.find((p) => p.id === postId);

  if (!post) {
    return next(
      new HttpError("해당 게시물을 찾지 못했습니다.", 404)
    );
  }

  res.json({ post });
};

const getPostByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const post = DUMMY_POSTS.find((p) => p.creator === userId);

  if (!post) {
    return next(
      new HttpError("해당 유저의 게시물을 찾지 못했습니다.", 404)
    );
  }

  res.json({ post });
};


exports.getPostById = getPostById;
exports.getPostByUserId = getPostByUserId;