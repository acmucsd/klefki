import type { ErrorResponse, EventDetails } from "@/util/types";
import type { NextApiRequest, NextApiResponse } from "next";
import { notion, verifyAuth } from "@/util";
import NextCors from "nextjs-cors";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any | ErrorResponse>
) {
  await NextCors(req, res, {
    methods: ["GET"],
    origin: "*",
    optionsSuccessStatus: 200,
  });

  try {
    await verifyAuth(req);
  } catch (err: any) {
    res.status(400).json({ error: err });
  }

  const calendar = await notion.getUpcomingCalendarEvents();
  const futureEvents = calendar.results.map((entry: any) => ({
    title: entry.properties["Name"].title[0].plain_text,
    date: entry.properties["Date"].date,
    url: entry.url,
  }));
  return res.status(200).json(futureEvents);
}
