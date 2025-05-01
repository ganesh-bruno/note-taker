import { useState } from 'react';
// Use a simpler approach with global fallback
import config from '../config';

const SimpleForm = () => {
  const [inputValue, setInputValue] = useState('');
  const [submittedValue, setSubmittedValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Get API URL from config
  const { API_URL } = config;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      // Use the global axios from CDN that we included in index.html
      const axiosInstance = window.axios || await import('axios').then(module => module.default);
      
      // Send data to backend API
      const response = await axiosInstance.post(`${API_URL}/submit`, { name: inputValue });
      
      // Update state with response (PostgreSQL response format)
      setSubmittedValue(response.data.name);
      setSuccess(true);
      setInputValue(''); // Clear the input
    } catch (error) {
      console.error('Error submitting form:', error);
      setError(error.response?.data?.error || 'Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Simple Form</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="input" className="block text-sm font-medium text-gray-700 mb-1">
            Enter your name:
          </label>
          <input
            type="text"
            id="input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type something..."
            required
            disabled={loading}
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {success && submittedValue && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md">
          <p>Successfully submitted: <span className="font-semibold">{submittedValue}</span></p>
          <p className="text-xs mt-1">Your data has been saved in the PostgreSQL database!</p>
        </div>
      )}
    </div>
  );
};

export default SimpleForm; 