const API_CONFIG = {
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'http://3.39.6.182:3001/api/v1'  // 브라우저에서 실제 서버 IP로 백엔드 호출
    : 'http://localhost:3001/api/v1',
  
  ENDPOINTS: {
    ARTICLES: '/articles',
    CATEGORIES: '/categories',
    TAGS: '/tags',
    USERS: '/users',
    HEALTH: '/health'
  }
};

export default API_CONFIG; 