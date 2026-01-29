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

// Request interceptor - Add standard headers
apiClient.interceptors.request.use(
    config => {
        // Auth token is now handled via HttpOnly Cookies (handled by browser automatically)
        // We no longer need to manually attach Authorization header for standard requests
        // unless we are in a specific environment that requires it (e.g. mobile app).
        // Since we are moving to cookies, we let the browser handle it with credentials: true
        config.withCredentials = true;

        // Still include Session ID for guest tracking
        const sessionId = getSessionId();
        config.headers['X-Session-Id'] = sessionId;

        // Add standard currency header
        try {
            const currencySettings = localStorage.getItem('Storiofy_currency_settings');
            if (currencySettings) {
                const { state } = JSON.parse(currencySettings);
                if (state?.currency) {
                    config.headers['X-Currency'] = state.currency;
                }
            }
        } catch (e) {
            console.error('Error reading currency from localStorage', e);
        }

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
                // Call refresh endpoint - it will read the HttpOnly refreshToken cookie
                // and set a new accessToken cookie
                await axios.post(
                    `${import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                // Retry original request
                return apiClient(originalRequest);
            } catch (refreshError) {
                // Refresh failed
                // Redirect to login if needed, or just let the error propagate
                // Only redirect if we thought we were logged in? 
                // Since we don't have local tokens, we might check a local "isLoggedIn" flag or similar
                // For now, if refresh fails, we assume session is dead.

                // Optional: Clear any client-side user state here
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export const authApi = {
    forgotPassword: (email: string) => apiClient.post('/auth/forgot-password', { email }),
    resetPassword: (data: any) => apiClient.post('/auth/reset-password', data),
};

export default apiClient;
