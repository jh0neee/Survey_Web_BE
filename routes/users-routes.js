const express = require("express");

const usersController = require("../controllers/users-controller");

const router = express.Router();

// 회원가입
router.post("/signup", usersController.signup);

// 로그인
router.post("/login", usersController.login);

module.exports = router;
