import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';

const Analytics = () => {
    const location = useLocation();

    useEffect(() => {
        // Initialize GA4 only once
        const gaId = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;

        if (gaId) {
            if (!window.window.ga4Initialized) {
                ReactGA.initialize(gaId);
                window.window.ga4Initialized = true;
            }

            // Send pageview with path
            ReactGA.send({ hitType: 'pageview', page: location.pathname + location.search });
        } else {
            console.warn('VITE_GOOGLE_ANALYTICS_ID is not defined. Analytics will not work.');
        }
    }, [location]);

    return null;
};

// Add type definition for custom window property
declare global {
    interface Window {
        ga4Initialized?: boolean;
    }
}

export default Analytics;
