import { useState, useEffect } from 'react';
// Use a simpler approach with global fallback
import config from '../config';

const SubmissionsList = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get API URL from config
  const { API_URL } = config;

  // Function to fetch submissions from backend
  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      // Use the global axios from CDN that we included in index.html
      const axiosInstance = window.axios || await import('axios').then(module => module.default);
      
      const response = await axiosInstance.get(`${API_URL}/submissions`);
      setSubmissions(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching submissions:', error);
      setError('Failed to load submissions');
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
      
      {!loading && submissions.length === 0 && (
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