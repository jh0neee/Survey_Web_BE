const {v4: uuidv4} = require('uuid');
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

const getPostsByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const posts = DUMMY_POSTS.filter((p) => p.author === userId);

  if (!posts || posts.length === 0 ) {
    return next(
      new HttpError("해당 유저의 게시물을 찾지 못했습니다.", 404)
    );
  }

  res.json({ posts });
};

const createPost = (req, res, next) => {
  const { title, content, author, createDate } = req.body;
  const createdPost = {
    id: uuidv4(),
    title,
    createDate,
    author, 
    content,
  };
  
  DUMMY_POSTS.push(createdPost);
  
  res.status(201).json({createdPost});
}

const updatePost = (req, res, next) => {
  const { title, content } = req.body;
  const postId = req.params.pid;

  const updatedPost ={ ...DUMMY_POSTS.find(p => p.id === postId) };
  const postIndex = DUMMY_POSTS.findIndex(p => p.id === postId);

  updatedPost.title = title;
  updatedPost.content = content;

  // 해당 객체의 인덱스를 새 updatedPost로 바꿈.
  DUMMY_POSTS[postIndex] = updatedPost;

  res.status(200).json({updatedPost});
}

const deletePost = (req, res, next) => {
  const postId = req.params.pid;
  DUMMY_POSTS = DUMMY_POSTS.filter(p => p.id !== postId);

  res.status(200).json({ message: '삭제된 게시물입니다.'});
}

exports.getPostById = getPostById;
exports.getPostsByUserId = getPostsByUserId;
exports.createPost = createPost;
exports.updatePost =updatePost;
exports.deledeletePost =deletePost;