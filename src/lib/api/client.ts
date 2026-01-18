import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Generate or retrieve session ID for guest users
function getSessionId(): string {
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
        sessionId = `guest-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
        localStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
}

// Request interceptor - Add auth token and session ID
apiClient.interceptors.request.use(
    config => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Always include session ID (for both guest and authenticated users)
        // Backend will use userId if authenticated, otherwise sessionId
        const sessionId = getSessionId();
        config.headers['X-Session-Id'] = sessionId;

        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized - Try to refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');

                // If no refresh token, this is a guest user - don't redirect to login
                if (!refreshToken) {
                    return Promise.reject(error);
                }

                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/auth/refresh`,
                    { refreshToken }
                );

                const { accessToken } = response.data;
                localStorage.setItem('accessToken', accessToken);

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                // Refresh failed - only redirect if there was a refresh token (authenticated user)
                const hadRefreshToken = !!localStorage.getItem('refreshToken');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');

                // Only redirect to login if user was previously authenticated
                // Guest users should not be redirected
                if (hadRefreshToken) {
                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
