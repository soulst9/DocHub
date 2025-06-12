import API_CONFIG from '../config/api';

class ApiClient {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      if (response.status === 204) {
        return null;
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // 파일 업로드용 요청 (FormData)
  async uploadRequest(endpoint, formData) {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData, // Content-Type 헤더를 설정하지 않음 (브라우저가 자동 설정)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Upload request failed:', error);
      throw error;
    }
  }

  // Articles API
  async getArticles(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `${API_CONFIG.ENDPOINTS.ARTICLES}${queryString ? `?${queryString}` : ''}`;
    return this.request(endpoint);
  }

  async getArticleById(id) {
    return this.request(`${API_CONFIG.ENDPOINTS.ARTICLES}/${id}`);
  }

  async createArticle(data) {
    return this.request(API_CONFIG.ENDPOINTS.ARTICLES, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateArticle(id, data) {
    return this.request(`${API_CONFIG.ENDPOINTS.ARTICLES}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteArticle(id) {
    return this.request(`${API_CONFIG.ENDPOINTS.ARTICLES}/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleFavorite(id) {
    return this.request(`${API_CONFIG.ENDPOINTS.ARTICLES}/${id}/favorite`, {
      method: 'PATCH',
    });
  }

  // Upload API
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    return this.uploadRequest('/api/v1/uploads/image', formData);
  }

  async uploadImages(files) {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });
    return this.uploadRequest('/api/v1/uploads/images', formData);
  }

  async deleteImage(filename) {
    return this.request(`/api/v1/uploads/image/${filename}`, {
      method: 'DELETE',
    });
  }

  // Categories API
  async getCategories() {
    return this.request(API_CONFIG.ENDPOINTS.CATEGORIES);
  }

  async getCategoryById(id) {
    return this.request(`${API_CONFIG.ENDPOINTS.CATEGORIES}/${id}`);
  }

  async createCategory(data) {
    return this.request(API_CONFIG.ENDPOINTS.CATEGORIES, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCategory(id, data) {
    return this.request(`${API_CONFIG.ENDPOINTS.CATEGORIES}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCategory(id) {
    return this.request(`${API_CONFIG.ENDPOINTS.CATEGORIES}/${id}`, {
      method: 'DELETE',
    });
  }

  // Health Check
  async healthCheck() {
    return this.request(API_CONFIG.ENDPOINTS.HEALTH);
  }
}

export default new ApiClient(); 