import axios from "axios";
import {
  IG_DOWNLOADER_URL as igDownloaderUrl,
  TIKTOK_DOWNLOADER_URL as tiktokDownloaderUrl,
  YT_DOWNLOADER_URL as ytDownloaderUrl,
} from "./config";

interface InstagramMedia {
  type: "photo" | "video";
  url: string;
}

interface YtMedia {
  title: string;
  author: string;
  thumbnail: string;
  mp4: string;
  mp3: string;
}

type IGDataItem = {
  creator: string;
  thumbnail: string;
  url: string;
};

export default class Downloader {
  url: string;
  constructor(url: string) {
    this.url = url;
  }

  private filterUniqueByThumbnail(data: InstagramMedia[]): InstagramMedia[] {
    const seen = new Set<string>();
    return data.filter((item) => {
      const url = new URL(item.url);
      if (seen.has(url.pathname)) {
        return false;
      }
      seen.add(url.pathname);
      return true;
    });
  }

  private decodeJwtAndGetMedia(url: string): InstagramMedia | null {
    try {
      const parsedUrl = new URL(url);
      const token = parsedUrl.searchParams.get("token");
      if (!token) return null;

      const [_, payloadB64] = token.split(".");

      const payload = JSON.parse(Buffer.from(payloadB64, "base64").toString());
      const mediaUrl = payload.url;
      const filename = payload.filename;
      if (!mediaUrl || !filename || typeof filename !== "string") return null;

      const extension = filename.split(".").pop()?.toLowerCase();

      if (!extension) return null;

      const videoExtensions = ["mp4", "mov", "avi", "mkv", "webm", "flv"];
      // const audioExtensions = ["mp3", "wav", "aac", "ogg", "m4a", "flac"];
      const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "bmp"];

      if (videoExtensions.includes(extension)) {
        return {
          type: "video",
          url: mediaUrl,
        };
      }
      if (imageExtensions.includes(extension)) {
        return {
          type: "photo",
          url: mediaUrl,
        };
      }
      return null;
    } catch (err) {
      console.error("Invalid JWT format:", err);
      return null;
    }
  }

  private async getMediaTypeFromUrl(url: string): Promise<string | null> {
    try {
      const response = await fetch(url, { method: "HEAD" });
      const contentType = response.headers.get("content-type");

      if (!contentType) return null;

      if (contentType.startsWith("image/")) return "image";
      if (contentType.startsWith("video/")) return "video";
      if (contentType.startsWith("audio/")) return "audio";

      return "other";
    } catch (error) {
      console.error("Error fetching media type:", error);
      return null;
    }
  }

  public async tiktok(url: string) {
    try {
      const response = await axios.post(`${tiktokDownloaderUrl}/api/`, {
        url,
        count: "12",
        web: "1",
        hd: "1",
      });

      const result = response.data;

      if (result?.data && result?.msg && result.msg == "success") {
        if (result.data?.images) {
          return result.data.images;
        }
        return `${tiktokDownloaderUrl}${result.data.play}`;
      } else {
        return "error";
      }
    } catch (e) {
      console.log(e);
    }
  }

  public async ig(url: string): Promise<InstagramMedia[]> {
    try {
      const response = await axios.get(`${igDownloaderUrl}`, {
        params: { url },
        headers: {
          "Content-Type": "application/json",
          "User-Agent": `btch/1.0.1`,
        },
      });

      const result = response.data;

      if (!Array.isArray(result)) {
        throw Error("Unable to download IG media");
      }

      if (!result.length) {
        throw Error("Unable to download IG media");
      }

      if (result.length == 1) {
        const data = result.at(0) as IGDataItem;
        const media = this.decodeJwtAndGetMedia(data.url);
        if (!media) {
          throw Error("Unable to download IG media");
        }

        return [media];
      }

      const results = result
        .map((media: IGDataItem) => this.decodeJwtAndGetMedia(media.url))
        .filter<InstagramMedia>((m): m is InstagramMedia => !!m);

      return this.filterUniqueByThumbnail(results);
    } catch (e) {
      console.log(e);
      throw Error("Unable to download IG media at the moment");
    }
  }

  public async youtube(url: string): Promise<YtMedia> {
    try {
      const response = await axios.get(`${ytDownloaderUrl}`, {
        params: { url },
        headers: {
          "Content-Type": "application/json",
          "User-Agent": `btch/1.0.1`,
        },
      });

      const result = response.data;

      if (!result?.mp4) {
        throw Error("Unable to download Youtube shorts media");
      }

      return result;
    } catch (e) {
      console.log(e);
      throw Error("Unable to download IG media at the moment");
    }
  }
}
