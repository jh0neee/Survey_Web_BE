const { v4: uuidv4 } = require("uuid");
const HttpError = require("../models/http-error");

const DUMMY_USERS = [
  {
    id: "u1",
    name: "AA매니저",
    email: "aa@test.com",
    password: "aatest",
  },
];

const signup = (req, res, next) => {
  const { name, email, password } = req.body;

  // 아이디 중복 여부
  const hasUser = DUMMY_USERS.find((u) => u.email === email);
  if (hasUser) {
    throw new HttpError("이미 존재하는 아이디입니다.", 422);
  }

  const createdUser = {
    id: uuidv4(),
    name,
    email,
    password,
  };

  DUMMY_USERS.push(createdUser);

  res.status(201).json({ createdUser });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedUser = DUMMY_USERS.find((u) => u.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError(
      "등록되지 않은 아이디이거나, 아이디 또는 비밀번호를 잘못 입력했습니다.",
      401
    );
  }

  res.json({ message: "로그인에 성공했습니다." });
};

exports.signup = signup;
exports.login = login;
