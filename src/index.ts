import { bot, port, webhookUrl, nodeEnv } from "./bot";
import { startServer } from "./server";

const isProduction =  nodeEnv === "production";

if (isProduction) {
  // Use webhooks in production
  startServer({ bot, port, webhookUrl });
} else {
  // Use polling in development
  bot.start();
  console.log("Bot is running in development mode (polling)...");
}
