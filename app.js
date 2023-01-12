const express = require('express');
const port = 5000;
const bodyParser = require('body-parser');

const postsRouter = require("./routes/posts-routes");

const app = express();

app.use('/api/posts', postsRouter);

app.use((error, req, res, next) => {
  if(res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500).json({message: error.message || '알 수 없는 오류입니다.'});

});

app.listen(port);