exports.handleError = (res, err) => {
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ message: '이미 존재하는 카테고리명입니다.' });
  }
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }
  // 기타 에러
  res.status(500).json({ message: '서버 오류', detail: err.message });
}; 