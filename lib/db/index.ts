import { drizzle } from 'drizzle-orm/neon-serverless';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

// Create the connection
const sql = neon(process.env.DATABASE_URL!);

// Create the database instance
export const db = drizzle(sql, { schema });

// Export schema for migrations
export * from './schema';

// Database utilities
export const closeDatabase = () => {
  // No explicit close for Neon, connection is managed by the driver
};

// Initialize database with tables (for development)
export const initializeDatabase = async () => {
  // This would typically be handled by Drizzle migrations
  // For now, we'll create a simple initialization
  console.log('Database initialized');
}; 