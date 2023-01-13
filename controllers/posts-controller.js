const { v4: uuidv4 } = require("uuid");
const dayjs = require("dayjs");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");

let DUMMY_POSTS = [
  {
    id: "p1",
    title: "만족도 조사",
    createDate: "2022.10.11",
    author: "작성자",
    content: "만족도 조사를 실시합니다.",
  },
];

const getPost = (req, res, next) => {
  res.json({ posts: DUMMY_POSTS });
};

const getPostById = (req, res, next) => {
  const postId = req.params.pid;
  const post = DUMMY_POSTS.find((p) => p.id === postId);

  if (!post) {
    return next(new HttpError("해당 게시물을 찾지 못했습니다.", 404));
  }

  res.json({ post });
};

const getPostsByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const posts = DUMMY_POSTS.filter((p) => p.author === userId);

  if (!posts || posts.length === 0) {
    return next(new HttpError("해당 유저의 게시물을 찾지 못했습니다.", 404));
  }

  res.json({ posts });
};

const createPost = (req, res, next) => {
  // 유효성 검사
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError("입력란을 다시 확인해주세요.", 422);
  }

  const { title, author, content } = req.body;
  const createdPost = {
    id: uuidv4(),
    title,
    createDate: dayjs().format("YYYY-MM-DD"),
    author,
    content,
  };

  DUMMY_POSTS.push(createdPost);

  res.status(201).json({ createdPost });
};

const updatePost = (req, res, next) => {
  // 유효성 검사
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError("입력란을 다시 확인해주세요.", 422);
  }

  const { title, content } = req.body;
  const postId = req.params.pid;

  const updatedPost = { ...DUMMY_POSTS.find((p) => p.id === postId) };
  const postIndex = DUMMY_POSTS.findIndex((p) => p.id === postId);

  updatedPost.title = title;
  updatedPost.content = content;

  // 해당 객체의 인덱스를 새 updatedPost로 바꿈.
  DUMMY_POSTS[postIndex] = updatedPost;

  res.status(200).json({ updatedPost });
};

const deletePost = (req, res, next) => {
  const postId = req.params.pid;
  const deletedPost = DUMMY_POSTS.filter((p) => p.id !== postId);

  if (!deletedPost) {
    throw new HttpError("해당 게시글을 찾지 못했습니다.", 404);
  }

  DUMMY_POSTS = deletedPost;
  res.status(200).json({ message: "삭제된 게시물입니다." });
};

exports.getPost = getPost;
exports.getPostById = getPostById;
exports.getPostsByUserId = getPostsByUserId;
exports.createPost = createPost;
exports.updatePost = updatePost;
exports.deledeletePost = deletePost;
