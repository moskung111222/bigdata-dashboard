import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 4000;
export const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
export const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
export const GOOGLE_APPLICATION_CREDENTIALS = process.env.GOOGLE_APPLICATION_CREDENTIALS || './service-account.json';
export const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || '';
