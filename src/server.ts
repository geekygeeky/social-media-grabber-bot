import express from "express";
import { bot } from "./bot";
import { webhookCallback } from "grammy";

export const startServer = () => {
  // Create an Express app
  const app = express();

  // Use JSON middleware to parse incoming requests
  app.use(express.json());

  // Set up the webhook endpoint
  // app.use(webhookCallback(bot, "express"));

  // Set webhook URL (replace with your actual HTTPS URL)
  // app.post(`/${process.env.BOT_TOKEN}`, webhookCallback(bot, "express"));

  app.use("/bot", webhookCallback(bot, "express")); // Attach webhook to /bot

  
  // Start the server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    bot.api.setWebhook(process.env.APP_URL || "https://b7d6-102-89-82-107.ngrok-free.app/bot");
    console.log(`Webhook server is running on port ${PORT}`);
  });
};
