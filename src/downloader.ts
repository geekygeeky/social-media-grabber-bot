import axios from "axios";
import { instagramGetUrl } from "instagram-url-direct";

export default class Downloader {
  url: string;
  constructor(url: string) {
    this.url = url;
  }

  public async tiktok(url: string) {
    try {
      const response = await axios.post("https://www.tikwm.com/api/", {
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
        return `https://www.tikwm.com${result.data.play}`;
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
