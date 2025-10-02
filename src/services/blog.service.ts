import axios from 'axios';

const BASE = 'https://blog.smshsewatrust.com/wp-json/wp/v2';

export const getBlogPosts = (params?: Record<string, any>) => {
  return axios.get(`${BASE}/posts`, { params }).then(res => {
    // Return both data and headers for pagination
    return {
      data: res.data,
      total: parseInt(res.headers['x-wp-total'] || '0', 10),
      totalPages: parseInt(res.headers['x-wp-totalpages'] || '1', 10)
    };
  });
};

export const getBlogPostById = (id: number | string) => {
  return axios.get(`${BASE}/posts/${id}`).then(res => res.data);
};

export const getMediaById = (id: number | string) => {
  return axios.get(`${BASE}/media/${id}`).then(res => res.data);
};
