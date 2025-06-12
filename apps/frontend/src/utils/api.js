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