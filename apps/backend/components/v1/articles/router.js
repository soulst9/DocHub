const express = require('express');
const controller = require('./controller');
const validator = require('./validator');
const router = express.Router();

// 통계 조회 (다른 라우트보다 먼저 배치)
router.get('/statistics', controller.getStatistics);

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
// 즐겨찾기 토글
router.patch('/:id/favorite', controller.toggleFavorite);

// 버전 관리 라우트
router.get('/:id/versions', controller.getVersions);
router.get('/:id/versions/:versionNumber', controller.getVersion);
router.post('/:id/versions/:versionNumber/restore', controller.restoreVersion);

module.exports = router; 