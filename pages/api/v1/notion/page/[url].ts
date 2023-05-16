import type { ErrorResponse, EventDetails } from "@/util/types";
import type { NextApiRequest, NextApiResponse } from "next";
import { notion, verifyAuth } from "@/util";
import NextCors from "nextjs-cors";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<EventDetails | ErrorResponse>
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

  // Validate URL string query param is provided
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "No query param found for page" });

  // Validate URL is a valid Notion page
  const pageUrl = decodeURIComponent(url as string);
  if (notion.isValidNotionPage(pageUrl) === false)
    return res.status(400).json({ error: "Invalid Notion page URL" });

  // Get uuid from page URL
  const pageUuid = notion.getUuid(pageUrl);

  // Get page details from uuid
  try {
    const details = await notion.getEventPageDetails(pageUuid);
    return res.status(200).json(details);
  } catch (err: any) {
    return res.status(400).send({ error: err.message });
  }
}
