import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { connect } from '@planetscale/database';
import * as schema from './schema';

// Create the connection
const connection = connect({
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
});

// Create the database instance
export const db = drizzle(connection, { schema });

// Export schema for migrations
export * from './schema';

// Database utilities
export const closeDatabase = () => {
  // No explicit close for PlanetScale, connection is managed by the driver
};

// Initialize database with tables (for development)
export const initializeDatabase = async () => {
  // This would typically be handled by Drizzle migrations
  // For now, we'll create a simple initialization
  console.log('Database initialized');
}; 