const mongoose = require("mongoose");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const Survey = require("../models/survey");
const Post = require("../models/post");

// 게시글 id로 특정 설문지 가져오기
const getSurvey = async (req, res, next) => {
  const postId = req.params.pid;
  let surveys;

  try {
    surveys = await Survey.find(
      { postCreator: postId },
      "questions postCreator"
    );
  } catch (err) {
    const error = new HttpError("설문지를 가져오는데 실패했습니다.", 500);
    return next(error);
  }

  if (!surveys || surveys.length === 0) {
    throw new HttpError("post id에 대한 설문을 찾을 수 없습니다.", 404);
  }

  res.json({
    surveys: surveys.map((survey) => survey.toObject({ getters: true })),
  });
};

// post
const createSurvey = async (req, res, next) => {
  // 요청 객체를 살펴본 후 벗어나는 유효성 오류가 없는지 점검함
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("유효하지 않은 입력 데이터를 전달했습니다", 422);
  }

  const { questions, postCreator } = req.body;

  const createdSurvey = new Survey({
    questions,
    postCreator,
  });

  let post;
  try {
    post = await Post.findById(postCreator);
  } catch (err) {
    const error = new HttpError("설문 생성에 실패", 500);
    return next(error);
  }

  if (!post) {
    const error = new HttpError(
      "제공된id에 해당하는 게시글을 찾을 수 없습니다.",
      404
    );
    return next(error);
  }

  try {
    const session = await mongoose.startSession();

    session.startTransaction();
    await createdSurvey.save({ session: session });

    post.surveys.push(createdSurvey);
    await post.save({ session: session });

    await session.commitTransaction();
  } catch (err) {
    const error = new HttpError("설문 생성에 실패했습니다.", 500);
    return next(error);
  }

  res.status(201).json({ survey: createdSurvey });
};

const createAnswers = async (req, res, next) => {
  const { surveyId } = req.params;
  const { answers } = req.body;

  const survey = await Survey.findById(surveyId);

  if (!survey) {
    throw new HttpError("설문을 찾을 수 없습니다.", 404);
  }

  try {
    const session = await mongoose.startSession();

    session.startTransaction();

    for (const questionId in answers) {
      const userAnswer = answers[questionId];
      const existingAnswer = survey.answers.find(
        (a) => a.questionId === questionId
      );

      if (existingAnswer) {
        if (Array.isArray(userAnswer)) {
          existingAnswer.responses.push(...userAnswer);
        } else {
          existingAnswer.responses.push(userAnswer);
        }
      } else {
        survey.answers.push({ questionId, answers: [userAnswer] });
      }
    }

    await survey.save({ session: session });

    await session.commitTransaction();
  } catch (err) {
    const error = new HttpError("답변 추가에 실패했습니다.", 500);
    return next(error);
  }

  res.status(201).json({ message: "답변이 추가되었습니다." });
};

exports.getSurvey = getSurvey;
exports.createSurvey = createSurvey;
exports.createAnswers = createAnswers;
