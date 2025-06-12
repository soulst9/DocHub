const express = require('express');
const controller = require('./controller');
const validator = require('./validator');
const router = express.Router();

// 문서 생성
router.post('/', validator.createArticle, controller.createArticle);
// 문서 목록
router.get('/', controller.getArticles);
// 문서 상세
router.get('/:id', controller.getArticleById);
// 문서 수정
router.put('/:id', validator.updateArticle, controller.updateArticle);
// 문서 삭제
router.delete('/:id', controller.deleteArticle);

module.exports = router; 