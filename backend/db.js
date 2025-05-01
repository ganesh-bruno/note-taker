import pg from 'pg';
import dotenv from 'dotenv';

// Load environment variables from .env file in development
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const { Pool } = pg;

// For production, Render will provide a DATABASE_URL
const connectionConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false // Required for Render PostgreSQL
      }
    }
  : {
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'fullstack_app',
      password: process.env.DB_PASSWORD || '',
      port: parseInt(process.env.DB_PORT || '5432', 10),
    };

// Create a new Pool instance with connection details
const pool = new Pool(connectionConfig);

// Initialize the database by creating the necessary tables
const initDatabase = async () => {
  try {
    // Create submissions table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS submissions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Get all submissions from the database
const getSubmissions = async () => {
  try {
    const result = await pool.query('SELECT * FROM submissions ORDER BY created_at DESC');
    return result.rows;
  } catch (error) {
    console.error('Error getting submissions:', error);
    throw error;
  }
};

// Add a new submission to the database
const addSubmission = async (name) => {
  try {
    const result = await pool.query(
      'INSERT INTO submissions (name) VALUES ($1) RETURNING *',
      [name]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error adding submission:', error);
    throw error;
  }
};

export { pool, initDatabase, getSubmissions, addSubmission }; 