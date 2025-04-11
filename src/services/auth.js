import api from './api'; // Este archivo debería configurar axios

// Función para iniciar sesión
export const login = async (email, password) => {
    try {
        const response = await api.post('/token', {
            username: email,
            password: password,
        });
        localStorage.setItem('token', response.data.access_token); // Guardamos el token
        return response.data; // Retornamos la respuesta
    } catch (error) {
        throw error.response.data; // Lanzamos el error si no es exitoso
    }
};

// Función para cerrar sesión
export const logout = () => {
    localStorage.removeItem('token'); // Limpiamos el token del localStorage
};

// Función para verificar si el usuario está autenticado
export const isAuthenticated = () => {
    return localStorage.getItem('token') !== null; // Verificamos si hay un token
};
export const register = async (email, password) => {
    try {
        const response = await api.post('/users/', {
            email: email,
            password: password,
        });
        return response.data; // Retornamos la respuesta
    } catch (error) {
        throw error.response.data; // Lanzamos el error si no es exitoso
    }
};