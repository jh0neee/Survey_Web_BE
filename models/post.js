const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: { type: String, required: true },
  author: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  createDate: { type: String, default: new Date() },
  content: { type: String, required: true }
});

module.exports = mongoose.model("Post", postSchema);
