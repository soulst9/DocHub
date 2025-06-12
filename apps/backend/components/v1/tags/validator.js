const { body } = require('express-validator');

exports.createTag = [
  body('name').isString().notEmpty().withMessage('태그명은 필수입니다.'),
  body('description').optional().isString(),
  (req, res, next) => {
    const errors = require('express-validator').validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

exports.updateTag = [
  body('name').optional().isString(),
  body('description').optional().isString(),
  (req, res, next) => {
    const errors = require('express-validator').validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
]; 