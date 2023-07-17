import { prisma } from "@/db";
import axios from "axios"

export const getTwitchAccessToken = async () => {
  const response = await axios.post('https://id.twitch.tv/oauth2/token', null, {
    params: {
      client_id: process.env.TWITCH_CLIENT_ID,
      client_secret: process.env.TWITCH_CLIENT_SECRET,
      grant_type: 'client_credentials'
    }
  })

  const oneDay = 24 * 60 * 60 * 1000;
  const tomorrow = new Date(new Date().getTime() + oneDay);

  return await prisma.twitch.create({
    data: {
      accessToken: response.data.access_token,
      expires: tomorrow,
      createdAt: new Date()
    }
  })
}