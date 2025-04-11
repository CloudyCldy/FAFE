import api from './api';

export const login = async (email, password) => {
    try {
        const response = await api.post('/token', {
            username: email,
            password,
        });
        localStorage.setItem('token', response.data.access_token);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const logout = () => {
    localStorage.removeItem('token');
};

export const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
};