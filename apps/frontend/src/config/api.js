const API_CONFIG = {
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'http://3.39.6.182:3001'  // 브라우저에서 실제 서버 IP로 백엔드 호출
    : 'http://localhost:3001',
  
  ENDPOINTS: {
    ARTICLES: '/api/v1/articles',
    CATEGORIES: '/api/v1/categories',
    TAGS: '/api/v1/tags',
    USERS: '/api/v1/users',
    HEALTH: '/api/health'
  }
};

export default API_CONFIG; 