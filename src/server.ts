import express from "express";
import { webhookCallback } from "grammy";
import { ServerProps } from "./types";

export const startServer = (props: ServerProps) => {
  const { bot, appUrl, port = "3000" } = props;

  const app = express();

  // Use JSON middleware to parse incoming requests
  app.use(express.json());

  // Set up the webhook endpoint
  app.use("/bot", webhookCallback(bot, "express"));

  if (!appUrl) {
    throw new Error("APP_URL is not defined in environment variables.");
  }

  const server = app.listen(port, async () => {
    try {
      const webhookInfo = await bot.api.getWebhookInfo();
      if (webhookInfo?.url) {
        await bot.api.deleteWebhook();
      }
      await bot.api.setWebhook(`${appUrl}/bot`);
      console.log(`Webhook server is running on port ${port}`);
    } catch (error) {
      console.error("Failed to set webhook:", error);
      server.close(() => {
        process.exit(1);
      });
    }
  });

  // Graceful shutdown
  const shutdown = () => {
    console.log("\nShutting down server gracefully...");
    server.close(() => {
      console.log("HTTP server closed.");
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};
