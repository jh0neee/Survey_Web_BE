const express = require('express');
const bodyParser = require('body-parser');

const postsRouter = require("./routes/posts-routes");

const app = express();

app.use('/api/posts', postsRouter);

app.listen(5000);