import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase, getSubmissions, addSubmission } from './db.js';

// Load environment variables in development
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration - restrict to your Vercel frontend in production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://your-frontend-domain.vercel.app'] // Update with your actual Vercel domain
    : ['http://localhost:5173', 'http://localhost:3000'],
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions)); // Use configured CORS
app.use(express.json()); // Parse JSON request bodies

// Initialize database
initDatabase()
  .then(() => console.log('Database setup complete'))
  .catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1); // Exit if database setup fails
  });

// API Routes
app.post('/api/submit', async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    // Add submission to database
    const newSubmission = await addSubmission(name);
    
    console.log('Received submission:', newSubmission);
    
    // Send back the created submission
    res.status(201).json(newSubmission);
  } catch (error) {
    console.error('Error processing submission:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Route to get all submissions
app.get('/api/submissions', async (req, res) => {
  try {
    const submissions = await getSubmissions();
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 