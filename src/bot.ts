import { Bot, Context } from "grammy";
import { BOT_TOKEN } from "./config";
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
      const videoUrl = await downloader.tiktok(url);
      if (!videoUrl || videoUrl == "error") {
        await ctx.reply("Failed to fetch media. Please try again.");
        return;
      }
      await ctx.replyWithVideo(videoUrl);
    } else if (url.includes("instagram.com")) {
      const media = await downloader.ig(url);
      if (!media) {
        throw Error("no video");
      }
      const result = media.map(({ type, url }) =>
        type === "video" ? ctx.replyWithVideo(url) : ctx.replyWithPhoto(url)
      );
      await Promise.allSettled(result);
    } else {
      await ctx.reply(
        "Unsupported URL. Please provide a TikTok or Instagram link."
      );
    }
  } catch (error) {
    console.error(error);
    await ctx.reply("Oops to fetch media 😬. Please try again later.");
  }
});

export { bot };
