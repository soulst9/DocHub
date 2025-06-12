exports.handleError = (res, err) => {
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ message: '이미 존재하는 사용자명 또는 이메일입니다.' });
  }
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }
  // 기타 에러
  res.status(500).json({ message: '서버 오류', detail: err.message });
}; 