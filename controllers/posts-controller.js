const mongoose = require("mongoose");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const Post = require("../models/post");
const User = require("../models/user");

const getPost = async (req, res, next) => {
  let posts;
  try {
    posts = await Post.find({}, 'title author createDate');
  } catch (err) {
    const error = new HttpError(
      "오류가 발생했습니다. 게시글을 찾을 수 없습니다.",
      500
    );
    return next(error);
  }

  res.json({ posts: posts.map((post) => post.toObject({ getters: true })) });
};

const getPostById = async (req, res, next) => {
  const postId = req.params.pid;

  let post;
  try {
    post = await Post.find({postId} ,"title author createDate content");
  } catch (err) {
    const error = new HttpError(
      "오류가 발생했습니다. 게시글을 찾을 수 없습니다.",
      500
    );
    return next(error);
  }

  if (!post) {
    const error = new HttpError("해당 게시물을 찾지 못했습니다.", 404);
    return next(error);
  }
  res.json({ post: post.map((post) => post.toObject({ getters: true })) });
};

const createPost = async (req, res, next) => {
  // 유효성 검사
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("입력란을 다시 확인해주세요.", 422));
  }

  const { title, author, content } = req.body;

  const createdPost = new Post({
    title,
    author,
    content
  });

  let user;
  try {
    user = await User.findById(author);
  } catch (err) {
    const error = new HttpError("실패했습니다. 다시 시도하세요.", 500);
    return next(error);
  }

  if(!user) {
    const error = new HttpError("해당 사용자를 찾을 수 없습니다.", 404);
    return next(error);
  }

  try {
    const session = await mongoose.startSession();
    
    session.startTransaction();
    await createdPost.save({ session: session });
    
    user.posts.push(createdPost);
    await user.save({ session: session });

    await session.commitTransaction();
  } catch (err) {
    const error = new HttpError("실패했습니다. 다시 시도하세요.", 500);
    return next(error);
  }

  res.status(201).json({ post: createdPost });
};

const updatePost = async (req, res, next) => {
  // 유효성 검사
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("입력란을 다시 확인해주세요.", 422));
  }

  const { title, content } = req.body;
  const postId = req.params.pid;

  let updatedpost;
  try {
    updatedpost = await Post.findById(postId);
  } catch (err) {
    const error = new HttpError(
      "오류가 발생했습니다. 업데이트할 수 없습니다.",
      500
    );
    return next(error);
  }

  updatedpost.title = title;
  updatedpost.content = content;

  try {
    await updatedpost.save();
  } catch (err) {
    const error = new HttpError("오류가 발생했습니다. 다시 시도하세요.", 500);
    return next(error);
  }

  res.status(200).json({ post: updatedpost.toObject({ getters: true }) });
};

const deletePost = async (req, res, next) => {
  const postId = req.params.pid;

  let deletedPost;
  try {
    deletedPost = await Post.findById(postId).populate('author');
  } catch (err) {
    const error = new HttpError(
      "오류가 발생했습니다. 삭제할 수 없습니다.",
      500
    );
    return next(error);
  }

  if(!deletedPost) {
    const error = new HttpError(
      "해당 게시글이 없습니다.",
      404
    );
    return next(error);
  }

  try {
    const session = await mongoose.startSession();
    
    session.startTransaction();
    await deletedPost.remove({ session: session });
    
    deletedPost.author.posts.pull(deletedPost);
    await deletedPost.author.save({ session: session });

    await session.commitTransaction();
  } catch (err) {
    const error = new HttpError("오류가 발생했습니다. 다시 시도하세요.", 500);
    return next(error);
  }

  res.status(200).json({ message: "삭제된 게시물입니다." });
};

exports.getPost = getPost;
exports.getPostById = getPostById;
exports.createPost = createPost;
exports.updatePost = updatePost;
exports.deledeletePost = deletePost;
