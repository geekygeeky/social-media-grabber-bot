import { type Bot } from "grammy";

export interface ServerProps {
    bot: Bot;
    webhookUrl?: string;
    port?: string;
  }