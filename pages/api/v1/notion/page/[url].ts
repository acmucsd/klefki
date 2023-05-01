import type { ErrorResponse, EventDetails } from "@/util/types";
import type { NextApiRequest, NextApiResponse } from "next";
import { notion, validateAuthToken } from "@/util";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<EventDetails | ErrorResponse>
) {
  // Validate GET request type
  if (req.method !== "GET") return res.status(400).json({ error: "Invalid request method" });

  const authToken = req.headers?.authorization;

  if (!authToken) return res.status(400).json({ error: "Missing auth token" });
  if (!validateAuthToken(authToken)) return res.status(400).json({ error: "Invalid auth token" });

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
  } catch (err) {
    return res.status(400).send({ error: "Notion page not found" });
  }
}
