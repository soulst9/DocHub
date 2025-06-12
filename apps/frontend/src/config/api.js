const API_CONFIG = {
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://your-domain.com/api/v1'  // 실제 도메인으로 변경 필요
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