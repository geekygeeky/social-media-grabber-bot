import { type Bot } from "grammy";

export interface ServerProps {
    bot: Bot;
    appUrl?: string;
    port?: string;
  }