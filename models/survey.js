const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Option = new Schema({
  value: String,
});

const QuestionsItem = new Schema({
  question: { type: String, required: true },
  selectOption: { type: String, required: true },
  options: [Option],
});

const AnswerSchema = new Schema({
  questionId: String,
  responses: [String],
});

const surveySchema = new Schema({
  questions: [QuestionsItem],
  postCreator: { type: mongoose.Types.ObjectId, required: true, ref: "Post" },
  answers: [AnswerSchema],
});

module.exports = mongoose.model("Survey", surveySchema);
