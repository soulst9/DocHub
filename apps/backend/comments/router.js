const express = require('express');
const { Comment, Article } = require('../models');
const router = express.Router();

// 특정 문서의 댓글 목록 조회
router.get('/article/:articleId', async (req, res) => {
  try {
    const { articleId } = req.params;
    
    // 문서 존재 확인
    const article = await Article.findByPk(articleId);
    if (!article) {
      return res.status(404).json({ error: '문서를 찾을 수 없습니다.' });
    }

    const comments = await Comment.findAll({
      where: { articleId },
      order: [['createdAt', 'ASC']]
    });

    res.json(comments);
  } catch (error) {
    console.error('댓글 조회 오류:', error);
    res.status(500).json({ error: '댓글을 불러오는 중 오류가 발생했습니다.' });
  }
});

// 댓글 작성
router.post('/article/:articleId', async (req, res) => {
  try {
    const { articleId } = req.params;
    const { content, authorName, authorEmail } = req.body;

    // 입력 검증
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: '댓글 내용을 입력해주세요.' });
    }

    if (!authorName || authorName.trim().length === 0) {
      return res.status(400).json({ error: '작성자 이름을 입력해주세요.' });
    }

    // 문서 존재 확인
    const article = await Article.findByPk(articleId);
    if (!article) {
      return res.status(404).json({ error: '문서를 찾을 수 없습니다.' });
    }

    const comment = await Comment.create({
      content: content.trim(),
      authorName: authorName.trim(),
      authorEmail: authorEmail?.trim() || null,
      articleId
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error('댓글 작성 오류:', error);
    res.status(500).json({ error: '댓글 작성 중 오류가 발생했습니다.' });
  }
});

// 댓글 수정
router.put('/:commentId', async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: '댓글 내용을 입력해주세요.' });
    }

    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ error: '댓글을 찾을 수 없습니다.' });
    }

    await comment.update({ content: content.trim() });
    res.json(comment);
  } catch (error) {
    console.error('댓글 수정 오류:', error);
    res.status(500).json({ error: '댓글 수정 중 오류가 발생했습니다.' });
  }
});

// 댓글 삭제
router.delete('/:commentId', async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ error: '댓글을 찾을 수 없습니다.' });
    }

    await comment.destroy();
    res.json({ message: '댓글이 삭제되었습니다.' });
  } catch (error) {
    console.error('댓글 삭제 오류:', error);
    res.status(500).json({ error: '댓글 삭제 중 오류가 발생했습니다.' });
  }
});

module.exports = router; 