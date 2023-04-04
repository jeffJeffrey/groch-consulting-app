import jwtDecode from 'jwt-decode';

const getAuthToken = () => {
    const token = localStorage.getItem('token');

    if (token) {
        const decodedToken: { exp: number } = jwtDecode(token);

        // Vérifiez si le token a expiré
        if (decodedToken.exp * 1000 < Date.now()) {
            localStorage.removeItem('token');
            return null;
        }

        return `Bearer ${token.substring(1, token.lastIndexOf('"'))}`;
    }

    return null;
};

const fetchWithAuth = (url: string, options?: any) => {
    const authToken = getAuthToken();

    if (authToken) {
        if (!options) {
            options = {};
        }

        if (!options.headers) {
            options.headers = {};
        }

        options.headers.Authorization = authToken;
    }

    return fetch(url, options);
};

export default fetchWithAuth;
