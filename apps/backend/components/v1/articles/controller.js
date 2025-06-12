const service = require('./service');
const { handleError } = require('./error');
const { generatePDF } = require('./pdf');

exports.createArticle = async (req, res) => {
  try {
    const article = await service.createArticle(req.body);
    res.status(201).json(article);
  } catch (err) {
    handleError(res, err);
  }
};

exports.getArticles = async (req, res) => {
  try {
    const articles = await service.getArticles();
    res.json(articles);
  } catch (err) {
    handleError(res, err);
  }
};

exports.getArticleById = async (req, res) => {
  try {
    const article = await service.getArticleById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json(article);
  } catch (err) {
    handleError(res, err);
  }
};

exports.updateArticle = async (req, res) => {
  try {
    const article = await service.updateArticle(req.params.id, req.body);
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json(article);
  } catch (err) {
    handleError(res, err);
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    const result = await service.deleteArticle(req.params.id);
    if (!result) return res.status(404).json({ message: 'Article not found' });
    res.status(204).send();
  } catch (err) {
    handleError(res, err);
  }
};

exports.toggleFavorite = async (req, res) => {
  try {
    const article = await service.toggleFavorite(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json(article);
  } catch (err) {
    handleError(res, err);
  }
};

exports.downloadPDF = async (req, res) => {
  try {
    const article = await service.getArticleById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });
    
    // PDF 생성
    const pdfBuffer = await generatePDF(article);
    
    // 파일명 생성 (한글 제목을 안전한 파일명으로 변환)
    const safeTitle = article.title.replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '_');
    const filename = `${safeTitle}_${new Date().toISOString().split('T')[0]}.pdf`;
    
    // PDF 응답 헤더 설정
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    
    // PDF 전송
    res.send(pdfBuffer);
  } catch (err) {
    console.error('PDF 다운로드 오류:', err);
    handleError(res, err);
  }
}; 