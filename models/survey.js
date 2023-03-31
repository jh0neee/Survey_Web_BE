const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Option = new Schema({
  value: String,
});

const surveySchema = new Schema({
  question: { type: String, required: true },
  options: [Option],
  postCreator: { type: mongoose.Types.ObjectId, required: true, ref: 'Post' },
});

module.exports = mongoose.model("Survey", surveySchema);
