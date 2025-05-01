import { useState, useEffect } from 'react';
// Use a simpler approach with global fallback
import config from '../config';

const SubmissionsList = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');

  // Get API URL from config
  const { API_URL } = config;

  // Function to fetch submissions from backend
  const fetchSubmissions = async () => {
    setLoading(true);
    setDebugInfo(`Attempting to fetch from: ${API_URL}/submissions`);
    
    try {
      // Use the global axios from CDN that we included in index.html
      const axiosInstance = window.axios || await import('axios').then(module => module.default);
      
      // Add more detailed error handling
      const response = await axiosInstance.get(`${API_URL}/submissions`, {
        // Add headers to help with CORS
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        // Handle errors properly
        validateStatus: null
      });
      
      // Add debug information
      setDebugInfo(`Response status: ${response.status}, Data: ${JSON.stringify(response.data)}`);
      
      if (response.status !== 200) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      setSubmissions(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching submissions:', error);
      setError(`Failed to load submissions: ${error.message}`);
      setDebugInfo(`Error: ${error.toString()}, ${error.message || ''}`);
      
      // Try to extract more error details if available
      if (error.response) {
        setDebugInfo(prev => `${prev}, Response: ${JSON.stringify(error.response.data)}, Status: ${error.response.status}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch submissions when component mounts
  useEffect(() => {
    fetchSubmissions();
  }, []);

  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Submissions</h2>
        <button 
          onClick={fetchSubmissions}
          className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors text-sm"
        >
          Refresh
        </button>
      </div>
      
      {loading && <p className="text-gray-500">Loading submissions...</p>}
      
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md mb-4">
          {error}
        </div>
      )}
      
      {/* Debug information - visible in development */}
      {debugInfo && (
        <div className="p-3 bg-gray-100 text-gray-700 rounded-md mb-4 text-xs overflow-auto max-h-32">
          <strong>Debug:</strong> {debugInfo}
        </div>
      )}
      
      {!loading && submissions.length === 0 && !error && (
        <p className="text-gray-500">No submissions yet.</p>
      )}
      
      {submissions.length > 0 && (
        <ul className="divide-y divide-gray-200">
          {submissions.map((submission) => (
            <li key={submission.id} className="py-3">
              <p className="font-semibold text-gray-800">{submission.name}</p>
              <p className="text-xs text-gray-500">
                {/* PostgreSQL timestamp field is called created_at */}
                {new Date(submission.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SubmissionsList; 