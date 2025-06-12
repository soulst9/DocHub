const express = require('express');
const controller = require('./controller');
const validator = require('./validator');
const router = express.Router();

// 회원가입
router.post('/', validator.createUser, controller.createUser);
// 사용자 목록
router.get('/', controller.getUsers);
// 사용자 상세
router.get('/:id', controller.getUserById);

module.exports = router; 