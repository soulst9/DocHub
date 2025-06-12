const { body } = require('express-validator');

exports.createArticle = [
  body('title').isString().notEmpty().withMessage('제목은 필수입니다.'),
  body('content').isString().notEmpty().withMessage('내용은 필수입니다.'),
  body('categoryId').isInt().withMessage('카테고리 ID는 숫자여야 합니다.'),
  body('authorId').isInt().withMessage('작성자 ID는 숫자여야 합니다.'),
  (req, res, next) => {
    const errors = require('express-validator').validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

exports.updateArticle = [
  body('title').optional().isString(),
  body('content').optional().isString(),
  body('categoryId').optional().isInt(),
  body('authorId').optional().isInt(),
  (req, res, next) => {
    const errors = require('express-validator').validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
]; 