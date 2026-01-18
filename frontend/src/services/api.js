import axios from 'axios';

// 1. Create a central Axios instance
const api = axios.create({
    baseURL: 'http://localhost:5000', // Connects to your Flask Backend
    headers: {
        'Content-Type': 'application/json',
    }
});

// 2. Add an "Interceptor" to attach tokens automatically
// (This saves you from manually adding the token to every request later)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;