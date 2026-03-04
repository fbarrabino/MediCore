import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// Request Interceptor: Attach the token
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Catch 403 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      const isSubscriptionError = error.response.data?.code === 'SUBSCRIPTION_REQUIRED';
      
      // We automatically redirect to /panel/suscripcion if SaaS read-only mode blocked writing
      if (isSubscriptionError) {
        window.location.href = '/panel/suscripcion?reason=expired';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
