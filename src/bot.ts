import { Bot, Context, InputFile } from "grammy";
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
    } else if (url.includes("youtube.com") && url.includes("shorts")) {
      // Handle Youtube Shorts URL
      const result = await downloader.youtube(url);
      // const videoStream = ytdl(url);
      const headers = {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive",
        Referer: "https://www.youtube.com/",
      };
      const response = await fetch(result.mp4, { headers });

      if (!response.ok || !response.body) {
        throw new Error(`Failed to fetch video: ${response.statusText}`);
      }
      const caption = `Author: ${result.author}\nTitle: ${result.title}`;
      await ctx.replyWithVideo(new InputFile(response.body), {
        caption,
        cover: result.thumbnail,
      }); // Send video
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
