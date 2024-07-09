import type { Data } from "@/util/types";
import type { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
import { addACMURL, handleExistingACMURL } from "@/util/acmurl";
import { verifyAuth } from "@/util";

/**
 * This endpoint is used to generate ACMURLs. ACMURL is ACM's custom link shortener, build using YOURLS. Parameters for request:
 * - shortlink: The shortlink to use for the ACMURL
 * - longlink: The longlink to redirect to
 * - title: The title of the ACMURL (optional)
 * @param req Request object
 * @param res Response object
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  await NextCors(req, res, {
    methods: ["POST"],
    origin: "*",
    optionsSuccessStatus: 200,
  });
  
  try {
    await verifyAuth(req);
  } catch (err: any) {
    return res.status(400).json({ error: err });
  }

  // Validate body provided
  if (!req.body) return res.status(400).json({ error: "No body provided" });
  const { shortlink, longlink, title } = req.body;

  // Validate body values exist and are acceptable
  if (!shortlink) return res.status(400).json({ error: "Missing required body field: shortlink" });
  if (!longlink) return res.status(400).json({ error: "Missing required body field: longlink" });

  try {
    // Try to create the ACMURL
    const shorturl = await addACMURL(shortlink, longlink, title || `Klefki - ${shortlink}`);
    return res.status(200).json({ message: `ACMURL created successfully! The url is ${shorturl}, redirecting to ${longlink}.` });
  } catch (e: any) {
    // If the URL already exists
    if (e.message == 'error:keyword') {
      try {
        const [previousURL, newURL] = await handleExistingACMURL(shortlink, longlink, title || `Klefki - ${shortlink}`);
        return res.status(200).json({ message: `ACMURL created successfully! The url is ${newURL}, redirecting to ${longlink}. The previous url was ${previousURL}.` });
      } catch (e2: any) {
        console.error(e2);
        return res.status(400).json({ error: e2 });
      }
    }
  }
}