import axios from "axios";
import { instagramGetUrl } from "instagram-url-direct";
const {
    tiktokDownloader,
  } = require("happy-dl");

export default class Downloader {
  url: string;
  constructor(url: string) {
    this.url = url;
  }

  public async tiktok(url: string) {
    try {
      const response = await axios.get(
        `https://www.tikwm.com/api/?url=${url}&hd=1`
      );

      const result = response.data;

      if (result?.data && result?.msg && result.msg == "success") {
        return result.data.hdplay;
      } else {
        return "error";
      }
    } catch (e) {
      console.log(e);
    }
  }

  public async ig(url: string) {
    try {
      let data = await instagramGetUrl(url);
      return data.media_details.map(({ type, url }) => ({ type, url }));
    } catch (e) {
      console.log(e);
    }
  }
}
