const { validationResult } = require("express-validator");

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

  // 유저 생성
  const createdUser = new User({
    name,
    email,
    password,
    posts: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("가입에 실패했습니다. 다시 시도해주세요.", 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
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
  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError(
      "등록되지 않은 아이디이거나, 아이디 또는 비밀번호를 잘못 입력했습니다.",
      401
    );
    return next(error);
  }

  res.json({
    message: "로그인에 성공했습니다.",
    user: existingUser.toObject({ getters: true }),
  });

};

exports.signup = signup;
exports.login = login;
