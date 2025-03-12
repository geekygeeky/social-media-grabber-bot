import express from "express";
import { bot } from "./bot";
import { webhookCallback } from "grammy";

export const startServer = () => {
  // Create an Express app
  const app = express();

  // Use JSON middleware to parse incoming requests
  app.use(express.json());

  // Set up the webhook endpoint
  app.post(`/${process.env.BOT_TOKEN}`, webhookCallback(bot, "express"));

  // Start the server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Webhook server is running on port ${PORT}`);
  });
};
