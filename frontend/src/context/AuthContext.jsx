import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUserLoggedIn();
        setupInterceptors();
    }, []);

    const setupInterceptors = () => {
        api.interceptors.response.use(
            (response) => response,
            async (error) => {
                if (error.response && error.response.status === 401) {
                    // Only redirect if not already on login page to avoid loops
                    // But handling this globally is tricky if 401 is valid for login failure
                    // Better: If request URL is NOT login/register, then logout
                    const isAuthRoute = error.config.url.includes('/auth/login') || error.config.url.includes('/auth/register') || error.config.url.includes('/auth/me');

                    if (!isAuthRoute || (error.config.url.includes('/auth/me'))) {
                        setUser(null);
                    }
                }
                return Promise.reject(error);
            }
        );
    };

    const checkUserLoggedIn = async () => {
        try {
            const { data } = await api.get('/auth/me');
            setUser(data);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        setUser(data);
        return data;
    };

    const register = async (email, password) => {
        const { data } = await api.post('/auth/register', { email, password });
        setUser(data);
        return data;
    };

    const logout = async () => {
        await api.post('/auth/logout');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
