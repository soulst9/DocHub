const express = require('express');
const controller = require('./controller');
const validator = require('./validator');
const router = express.Router();

// 문서에 태그 연결
router.post('/', validator.addTagToArticle, controller.addTagToArticle);
// 문서에서 태그 해제
router.delete('/', validator.removeTagFromArticle, controller.removeTagFromArticle);
// 연결 목록 조회
router.get('/', controller.getArticleTags);
// 연결 상세 조회 (id 기반)
router.get('/:id', controller.getArticleTagById);

module.exports = router; 