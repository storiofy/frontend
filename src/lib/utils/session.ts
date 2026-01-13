/**
 * Session ID utility for guest users
 * Generates and stores a session ID in localStorage for cart operations
 */

const SESSION_ID_KEY = 'Storiofy_session_id';

export function getSessionId(): string {
    let sessionId = localStorage.getItem(SESSION_ID_KEY);
    
    if (!sessionId) {
        // Generate a new session ID (UUID-like format)
        sessionId = generateSessionId();
        localStorage.setItem(SESSION_ID_KEY, sessionId);
    }
    
    return sessionId;
}

export function clearSessionId(): void {
    localStorage.removeItem(SESSION_ID_KEY);
}

function generateSessionId(): string {
    // Generate a UUID-like string
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}




