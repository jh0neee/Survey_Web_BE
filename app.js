require("dotenv").config();
const { PORT, MONGO_URL } = process.env;

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const postsRouter = require("./routes/posts-routes");
const usersRouter = require("./routes/users-routes");
const HttpError = require("./models/http-error");

mongoose.set("strictQuery", true);

mongoose
  .connect(MONGO_URL)
  .then(() => app.listen(PORT))
  .catch((err) => console.log(err));

mongoose.connection.on("connected", () => {
  console.log("MongoDB Connected");
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use("/api/posts", postsRouter);
app.use("/api/user", usersRouter);

// 지원되지 않은 routes에 대한 오류처리
app.use((req, res, next) => {
  const error = new HttpError("route를 찾지 못했습니다.");
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || "알 수 없는 오류입니다." });
});
