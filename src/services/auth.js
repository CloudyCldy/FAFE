import api from './api'; // Este archivo debería configurar axios

// Función para iniciar sesión
export const login = async (email, password) => {
    try {
        const response = await api.post('/token', {
            email: email, // 👈 Este campo debe ser "email", no "username"
            password: password,
        });
        localStorage.setItem('token', response.data.access_token);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
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
export const register = async (email, password, full_name) => {
    try {
        const response = await api.post('/register', {
            email,
            password,
            full_name, // Asegurarse de incluirlo
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { detail: 'Error desconocido' };
    }
};
