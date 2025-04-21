import dotenv from 'dotenv';

dotenv.config();

export const BOT_TOKEN = process.env.BOT_TOKEN || '';
export const PORT = process.env.PORT || '3000';
export const WEBHOOK_URL = process.env.WEBHOOK_URL;
export const NODE_ENV = process.env.NODE_ENV;
