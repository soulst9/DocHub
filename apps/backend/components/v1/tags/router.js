const express = require('express');
const controller = require('./controller');
const validator = require('./validator');
const router = express.Router();

// 태그 생성
router.post('/', validator.createTag, controller.createTag);
// 태그 목록
router.get('/', controller.getTags);
// 태그 상세
router.get('/:id', controller.getTagById);
// 태그 수정
router.put('/:id', validator.updateTag, controller.updateTag);
// 태그 삭제
router.delete('/:id', controller.deleteTag);

module.exports = router; 