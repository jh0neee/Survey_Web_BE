const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: { type: String, required: true },
  author: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  createDate: { type: Date, default: Date.now },
  content: { type: String, required: true },
  surveys: [{ type: mongoose.Types.ObjectId, required: true, ref: "Survey" }],
});

module.exports = mongoose.model("Post", postSchema);
