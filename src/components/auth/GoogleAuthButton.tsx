import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import apiClient from '@lib/api/client';
import { useAuthStore } from '@store/authStore';

interface GoogleAuthButtonProps {
    redirectTo?: string;
    label?: string;
}

// Type for Google OAuth token response
interface GoogleTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    scope: string;
    authuser?: string;
    prompt?: string;
    hd?: string;
}

export default function GoogleAuthButton({ redirectTo = '/', label = 'Google' }: GoogleAuthButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse: GoogleTokenResponse) => {
            setIsLoading(true);
            
            try {
                // Get user info using the access token
                const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.access_token}`,
                    },
                });
                
                const userInfo = await userInfoResponse.json();
                
                // Send to backend for authentication
                const response = await apiClient.post('/auth/google', {
                    accessToken: tokenResponse.access_token,
                    email: userInfo.email,
                    firstName: userInfo.given_name,
                    lastName: userInfo.family_name,
                    googleId: userInfo.sub,
                });

                const { accessToken, refreshToken, userId, email, firstName, lastName, isAdmin } = response.data;

                setAuth(
                    { id: userId, email, firstName, lastName, isAdmin: isAdmin || false },
                    accessToken,
                    refreshToken
                );

                navigate(redirectTo);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Google sign-in failed. Please try again.');
            } finally {
                setIsLoading(false);
            }
        },
        onError: () => {
            setError('Google sign-in was cancelled or failed. Please try again.');
            setIsLoading(false);
        },
    });

    const handleClick = () => {
        setError(null);
        setIsLoading(true);
        googleLogin();
    };

    return (
        <div className="flex flex-col gap-2">
            <button
                type="button"
                onClick={handleClick}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                </svg>
                <span>{isLoading ? 'Connecting...' : label}</span>
            </button>
            {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {error}
                </div>
            )}
        </div>
    );
}
