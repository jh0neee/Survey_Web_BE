const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const surveySchema = new Schema({
  questionType: { type: String, required: true },
  question: {type: String, required: true},
  answer: { type: String, required: true },
  options: [{ type: String }],
});

module.exports = mongoose.model("Survey", surveySchema);
