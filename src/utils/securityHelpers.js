import Cookies from 'js-cookie';

/**
 * Configuración segura para cookies
 */
export const COOKIE_CONFIG = {
    // Cookies solo accesibles por HTTPS en producción
    secure: process.env.NODE_ENV === 'production',
    // Previene acceso desde JavaScript (solo para cookies de sesión)
    httpOnly: false, // No podemos usar httpOnly desde el cliente, pero el backend debería configurarlo
    // SameSite previene CSRF
    sameSite: 'strict',
    // Expiración de 1 día
    expires: 1
};

/**
 * Guarda una cookie de forma segura
 */
export const setSecureCookie = (name, value, options = {}) => {
    const config = { ...COOKIE_CONFIG, ...options };
    Cookies.set(name, value, config);
};

/**
 * Obtiene una cookie de forma segura
 */
export const getSecureCookie = (name) => {
    return Cookies.get(name);
};

/**
 * Elimina una cookie de forma segura
 */
export const removeSecureCookie = (name) => {
    Cookies.remove(name);
};

/**
 * Sanitiza entrada de usuario para prevenir XSS
 */
export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    
    return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
};

/**
 * Valida token JWT sin decodificarlo completamente
 */
export const isValidToken = (token) => {
    if (!token) return false;
    
    // Validar formato básico de JWT (3 partes separadas por puntos)
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    try {
        // Verificar que se pueda decodificar el payload
        const payload = JSON.parse(atob(parts[1]));
        
        // Verificar expiración si existe
        if (payload.exp) {
            const now = Math.floor(Date.now() / 1000);
            if (payload.exp < now) {
                return false; // Token expirado
            }
        }
        
        return true;
    } catch (error) {
        console.error('Token inválido:', error);
        return false;
    }
};

/**
 * Valida y obtiene datos del usuario de forma segura
 */
export const getSecureUserData = () => {
    try {
        const userCookie = getSecureCookie('user');
        if (!userCookie) return null;
        
        const user = JSON.parse(userCookie);
        return user;
    } catch (error) {
        console.error('Error al obtener datos de usuario:', error);
        return null;
    }
};

/**
 * Limpia todas las cookies de sesión
 */
export const clearSessionCookies = () => {
    removeSecureCookie('token');
    removeSecureCookie('user');
};
