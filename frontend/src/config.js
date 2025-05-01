// Environment-specific configuration
const config = {
  // API URL based on environment
  API_URL: import.meta.env.PROD 
    ? 'https://your-backend-name.onrender.com/api' // Will update this with actual Render URL later
    : 'http://localhost:5000/api'
};

export default config; 