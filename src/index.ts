import { bot } from "./bot";
import { startServer } from "./server";

const isProduction = process.env.NODE_ENV === "production";

if (isProduction) {
  // Use webhooks in production
  startServer();
} else {
  // Use polling in development
  bot.start();
  console.log("Bot is running in development mode (polling)...");
}
