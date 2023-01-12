const express = require('express');
const port = 5000;
const bodyParser = require('body-parser');

const postsRouter = require("./routes/posts-routes");
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

app.use('/api/posts', postsRouter);

// 지원되지 않은 routes에 대한 오류처리
app.use((req, res, next) => {
  const error = new HttpError('route를 찾지 못했습니다.');
  throw error;
})

app.use((error, req, res, next) => {
  if(res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500).json({message: error.message || '알 수 없는 오류입니다.'});

});

app.listen(port);