import { Bot, Context } from "grammy";
import {
  BOT_TOKEN,
  PORT as port,
  APP_URL as appUrl,
  NODE_ENV as nodeEnv,
} from "./config";
import Downloader from "./downloader";

const bot = new Bot(BOT_TOKEN);

bot.on("message", async (ctx: Context) => {
  const url = ctx.message?.text;
  if (!url) return;

  // Notify user that the bot is fetching media
  await ctx.reply("Fetching media... Please wait.⏳");

  const downloader = new Downloader(url);

  try {
    if (url.includes("tiktok.com")) {
      // Handle TikTok URL
      const videoUrl = await downloader.tiktok(url);
      if (!videoUrl || videoUrl === "error") {
        await ctx.reply("Failed to fetch media. Please try again.");
        return;
      }

      if (Array.isArray(videoUrl)) {
        const result = videoUrl.map((url) => ctx.replyWithPhoto(url));
        await Promise.allSettled(result); // Send all photos concurrently
      } else {
        await ctx.replyWithVideo(videoUrl); // Send video
      }
    } else if (url.includes("instagram.com")) {
      // Handle Instagram URL
      const media = await downloader.ig(url);
      if (!media || media.length === 0) {
        throw new Error("No media found");
      }

      const result = media.map(({ type, url }) =>
        type === "video" ? ctx.replyWithVideo(url) : ctx.replyWithPhoto(url)
      );
      await Promise.allSettled(result); // Send all media concurrently
    } else {
      await ctx.reply(
        "Unsupported URL. Please provide a TikTok or Instagram link."
      );
    }
    return;
  } catch (error) {
    console.error(error);
    await ctx.reply(
      "Oops, there was an issue fetching media 😬. Please try again later."
    );
  }
});

export { bot, port, appUrl, nodeEnv };
