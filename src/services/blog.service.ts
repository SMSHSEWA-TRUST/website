import axios from 'axios';

const BASE = 'https://blog.smshsewatrust.com/wp-json/wp/v2';

// Create a dedicated axios instance for WordPress API with proper error handling
const wpAxios = axios.create({
  baseURL: BASE,
  timeout: 15000, // 15 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for better error handling
wpAxios.interceptors.response.use(
  response => response,
  error => {
    console.error('WordPress API Error:', error);
    if (error.response) {
      // Server responded with error status
      console.error('Response error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request made but no response received
      console.error('No response received:', error.request);
    } else {
      // Error setting up request
      console.error('Request setup error:', error.message);
    }
    return Promise.reject(error);
  }
);

export const getBlogPosts = (params?: Record<string, any>) => {
  return wpAxios.get('/posts', { 
    params: {
      ...params,
      _embed: true // Always embed media for featured images
    }
  }).then(res => {
    // Return both data and headers for pagination
    return {
      data: res.data,
      total: parseInt(res.headers['x-wp-total'] || '0', 10),
      totalPages: parseInt(res.headers['x-wp-totalpages'] || '1', 10)
    };
  }).catch(error => {
    console.error('getBlogPosts failed:', error);
    throw error;
  });
};

export const getBlogPostById = (id: number | string) => {
  return wpAxios.get(`/posts/${id}`, {
    params: {
      _embed: true // Embed media for featured images
    }
  }).then(res => res.data).catch(error => {
    console.error(`getBlogPostById(${id}) failed:`, error);
    throw error;
  });
};

export const getMediaById = (id: number | string) => {
  return wpAxios.get(`/media/${id}`).then(res => res.data).catch(error => {
    console.error(`getMediaById(${id}) failed:`, error);
    throw error;
  });
};
