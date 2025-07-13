import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

const query = neon(process.env.DATABASE_URL!);

export const db = drizzle(query, { schema });

export * from './schema';

export const closeDatabase = () => {
  // No explicit close for Neon, connection is managed by the driver
};

export const initializeDatabase = async () => {
  console.log('Database initialized');
}; 