import { prisma } from "@/db";
import { extractVideoId } from "@/utils/twitch";
import axios from "axios"

export const getTwitchVideoData = async (url: string, accessToken: string) => {
  const id = extractVideoId(url);
  const apiUrl = `https://api.twitch.tv/helix/videos?id=${id}`;

  return await axios.get(apiUrl, {
    headers: {
      'Client-ID': process.env.TWITCH_CLIENT_ID,
      'Authorization': `Bearer ${accessToken}`,
    },
  }).then(response => response.data.data[0])
}