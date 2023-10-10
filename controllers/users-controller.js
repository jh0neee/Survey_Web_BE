// const { JWT_KEY } = process.env;

const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const User = require("../models/user");

const signup = async (req, res, next) => {
  // 유효성 검사
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("아이디와 비밀번호를 다시 확인해주세요", 422));
  }

  const { name, email, password } = req.body;

  // 아이디 중복 여부
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("가입에 실패했습니다. 다시 시도해주세요.", 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError("가입된 아이디입니다. 로그인해주세요.", 422);
    return next(error);
  }

  // 암호 해싱
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError("다시 시도해주세요", 500);
    return next(error);
  }

  // 유저 생성
  const createdUser = new User({
    name,
    email,
    password: hashedPassword,
    posts: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("가입에 실패했습니다. 다시 시도해주세요.", 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("가입에 실패했습니다. 다시 시도해주세요.", 500);
    return next(error);
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "로그인에 실패했습니다. 다시 시도해주세요.",
      500
    );
    return next(error);
  }

  // 이메일 패스워드 일치검사
  if (!existingUser) {
    const error = new HttpError(
      "등록되지 않은 아이디이거나, 아이디 또는 비밀번호를 잘못 입력했습니다.",
      403
    );
    return next(error);
  }

  // 사용자가 존재할 경우 비밀번호 확인
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "로그인에 실패했습니다. 다시 시도해주세요.",
      500
    );
    return next(error);
  }

  // 비밀번호 올바르지 않음
  if (!isValidPassword) {
    const error = new HttpError(
      "등록되지 않은 아이디이거나, 아이디 또는 비밀번호를 잘못 입력했습니다.",
      403
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "로그인에 실패했습니다. 다시 시도해주세요.",
      500
    );
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
  });
};

exports.signup = signup;
exports.login = login;
