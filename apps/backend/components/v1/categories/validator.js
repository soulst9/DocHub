const { body, validationResult } = require('express-validator');

exports.createCategory = [
  body('name').isLength({ min: 2 }).withMessage('카테고리명은 2자 이상이어야 합니다.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

exports.updateCategory = [
  body('name').optional().isLength({ min: 2 }).withMessage('카테고리명은 2자 이상이어야 합니다.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
]; 