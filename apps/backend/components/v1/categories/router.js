const express = require('express');
const controller = require('./controller');
const validator = require('./validator');
const router = express.Router();

// 카테고리 생성
router.post('/', validator.createCategory, controller.createCategory);
// 카테고리 목록
router.get('/', controller.getCategories);
// 카테고리 상세
router.get('/:id', controller.getCategoryById);
// 카테고리 수정
router.put('/:id', validator.updateCategory, controller.updateCategory);
// 카테고리 삭제
router.delete('/:id', controller.deleteCategory);

module.exports = router; 