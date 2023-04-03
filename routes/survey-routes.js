const express = require("express");
const { check } = require("express-validator");

const surveyControllers = require("../controllers/survey-controller");

const router = express.Router();

// 게시글 id로 특정 설문지 가져오기
router.get("/:pid", surveyControllers.getSurvey);

// 새로운 설문지 생성
router.post(
  "/",
  [check("question").not().isEmpty(), check("options").not().isEmpty()],
  surveyControllers.createSurvey
);

module.exports = router;
