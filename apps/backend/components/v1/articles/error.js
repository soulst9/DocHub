exports.handleError = (res, err) => {
  // Sequelize validation 에러 등 구분 가능
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({ message: err.errors.map(e => e.message).join(', ') });
  }
  res.status(500).json({ message: err.message || 'Internal Server Error' });
}; 