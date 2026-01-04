import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' ? '/api' : 'http://localhost:5000/api'),
    withCredentials: true, // Important for cookies
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // If 401, mostly let the context handle logout if persistent
            // or just reject
        }
        return Promise.reject(error);
    }
);

export default api;
