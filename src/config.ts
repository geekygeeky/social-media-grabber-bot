import dotenv from 'dotenv';

dotenv.config();

export const BOT_TOKEN = process.env.BOT_TOKEN || '';
export const PORT = process.env.PORT || '3000';
export const APP_URL = process.env.APP_URL;
export const NODE_ENV = process.env.NODE_ENV;
export const IG_DOWNLOADER_URL = process.env.IG_DOWNLOADER_URL;
export const TIKTOK_DOWNLOADER_URL = process.env.TIKTOK_DOWNLOADER_URL;

