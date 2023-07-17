import { prisma } from "@/db";
import { NextApiRequest, NextApiResponse } from "next";
import { headers } from "next/headers";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(400).json({ error: 'Bad Request' });
  }

  const { url, startTime, endTime } = req.body;

  if (!url || url.length < 1) {
    return res.status(400).json({ error: 'Missing url param' });
  }

  if (!url?.includes('twitch.tv')) {
    return res.status(400).json({ error: 'For now we only support twitch videos' });
  }

  if (endTime < startTime) {
    return res.status(400).json({ error: 'Start time needs to be before End time!' });
  }

  const currentVodAnalysis = await prisma.vodAnalysis.findFirst({ where: { url } });

  try {
    if (currentVodAnalysis) {
      await prisma.vodAnalysis.update({
        where: { id: currentVodAnalysis.id },
        data: {
          startTime, endTime
        }
      })
    } else {
      await prisma.vodAnalysis.create({
        data: { url, startTime, endTime }
      });
    }

  } catch (error) {
    console.error('[vodAnalysis] - Error', error)
    return res.status(500)
  }

  try {
    // Time to queue the vod analysis
    const { host } = req.headers;
    const protocol = process?.env.NODE_ENV === "development" ? "http" : "https"
    fetch(`${protocol}://${host}/api/analyze-vods`);
  } catch (error) {
    console.error('[vodAnalysis] - Analyze vods queue', error)
  }

  return res.status(200).json({ status: 'SUCCESS' })
}