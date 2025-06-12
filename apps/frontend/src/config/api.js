const API_CONFIG = {
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'http://localhost:3001/api/v1'  // 서버 내부에서 백엔드 호출
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