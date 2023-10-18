import type { ErrorResponse, EventDetails } from "@/util/types";
import type { NextApiRequest, NextApiResponse } from "next";
import { notion, verifyAuth } from "@/util";
import NextCors from "nextjs-cors";
import { parseEventPage } from "@/util/notion";

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
    return res.status(400).json({ error: err });
  }

  const calendar = await notion.getUpcomingCalendarEvents();
  const futureEvents = calendar.results.map((entry: any) => {
    const eventDetails = parseEventPage(entry)
    return {
      title: eventDetails.title,
      date: eventDetails.date,
      community: eventDetails.community,
      url: entry.url
    }
  });
  return res.status(200).json(futureEvents);
}
