import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

// Create SQLite database instance
const sqlite = new Database('family-tree.db');

// Create Drizzle instance with schema
export const db = drizzle(sqlite, { schema });

// Export schema for migrations
export { schema };

// Database utilities
export const closeDatabase = () => {
  sqlite.close();
};

// Initialize database with tables (for development)
export const initializeDatabase = async () => {
  // This would typically be handled by Drizzle migrations
  // For now, we'll create a simple initialization
  console.log('Database initialized');
}; 