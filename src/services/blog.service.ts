import axios from 'axios';

const BASE = 'https://blog.smshsewatrust.com/wp-json/wp/v2';

export const getBlogPosts = (params?: Record<string, any>) => {
  return axios.get(`${BASE}/posts`, { params }).then(res => res.data);
};

export const getBlogPostById = (id: number | string) => {
  return axios.get(`${BASE}/posts/${id}`).then(res => res.data);
};

export const getMediaById = (id: number | string) => {
  return axios.get(`${BASE}/media/${id}`).then(res => res.data);
};
