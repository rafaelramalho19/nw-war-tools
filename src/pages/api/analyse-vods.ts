import { prisma } from "@/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(400).json({ error: 'Bad Request' });
  }

  const pendingAnalysis = await prisma.vodAnalysis.findFirst({ where: { status: 'PENDING' } });

  console.log({ TODO: pendingAnalysis });

  return res.status(200).json({ status: 'SUCCESS' })
}