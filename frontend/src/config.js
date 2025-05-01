// Environment-specific configuration
const config = {
  // API URL based on environment
  API_URL: import.meta.env.PROD 
    ? 'https://note-taker-8q5a.onrender.com/api' // Actual Render backend URL
    : 'http://localhost:5000/api'
};

export default config; 