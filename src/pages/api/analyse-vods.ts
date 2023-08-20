import { prisma } from "@/db";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(400).json({ error: 'Bad Request' });
  }

  const pendingAnalysis = await prisma.vodAnalysis.findFirst({ where: { status: 'PENDING' } });

  if (!pendingAnalysis) {
    return res.status(200).json({ status: 'NO_PENDING_ANALYSIS' });
  }

  await (async () => {
    try {
      // Launch a headless browser instance
      const browser = await puppeteer.launch();

      // Open a new page
      const page = await browser.newPage();

      // Navigate to the Twitch video URL
      await page.goto(pendingAnalysis.url);

      // Wait for the video player to load
      await page.waitForSelector('video', { visible: true });

      // Extract the video player element
      const videoPlayer = await page.$('video');

      // Get the source URL of the video
      const videoSourceUrl = await page.evaluate(video => video?.src, videoPlayer) as string;

      // Close the browser
      await browser.close();

      // Download the video file
      const response = await axios.get(videoSourceUrl, { responseType: 'stream' });
      const videoPath = `vods/video_${pendingAnalysis.id}/video.mp4`;
      const videoStream = response.data.pipe(fs.createWriteStream(videoPath));

      videoStream.on('finish', () => {
        // Video download completed
        console.log('Video download completed');

        // Use ffmpeg to extract frames from the video
        ffmpeg(videoPath)
          .on('filenames', (filenames) => {
            // Handle the extracted frame filenames
            console.log(filenames);
          })
          .on('end', () => {
            console.log('Frame extraction finished');
            // Perform further operations on the extracted frames
          })
          .screenshots({
            timestamps: ['10', '20', '30'], // Specify the timestamps of frames you want to extract
            folder: `vods/video_${pendingAnalysis.id}/`,
            size: '320x240', // Specify the size of the extracted frames
            filename: 'frame-%s.png', // Specify the filename pattern for the extracted frames
          });
      });
    } catch (error) {
      console.error('Error extracting frames from Twitch VOD:', error);
    }
  })();

  console.log({ TODO: pendingAnalysis });

  return res.status(200).json({ status: 'SUCCESS' })
}