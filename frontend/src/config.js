// Central configuration for frontend external links and API
// If you buy a new domain, just update the URLs here and all pages will update automatically.

// The frontend will connect to the API URL defined in your Vercel (.env.production) dashboard.
export const API_URL = import.meta.env.VITE_API_URL || 'https://your-render-app.onrender.com/api/v1';

export const config = {
  // Website URL
  schoolWebsiteUrl: import.meta.env.VITE_SCHOOL_WEBSITE_URL || 'https://school-website-sigma-one.vercel.app',
  
  // SMS Web App URL (this app)
  smsAppUrl: import.meta.env.VITE_SMS_APP_URL || 'https://sms-app-red.vercel.app',
};
