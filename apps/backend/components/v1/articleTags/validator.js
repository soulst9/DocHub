const { body } = require('express-validator');

exports.addTagToArticle = [
  body('articleId').isInt().withMessage('articleId는 숫자여야 합니다.'),
  body('tagId').isInt().withMessage('tagId는 숫자여야 합니다.'),
  (req, res, next) => {
    const errors = require('express-validator').validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

exports.removeTagFromArticle = [
  body('articleId').isInt().withMessage('articleId는 숫자여야 합니다.'),
  body('tagId').isInt().withMessage('tagId는 숫자여야 합니다.'),
  (req, res, next) => {
    const errors = require('express-validator').validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
]; 