import type { Data } from "@/util/types";
import type { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
import { addACMURL, getAllACMURL, handleExistingACMURL } from "@/util/acmurl";
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
    methods: ["GET"],
    origin: "*",
    optionsSuccessStatus: 200,
  });

  try {
    await verifyAuth(req);
  } catch (err: any) {
    return res.status(400).json({ error: err });
  }

  try {
    // Try to get all ACMURLs
    const ACMURLs = await getAllACMURL();
    return res.status(200).json({ message: ACMURLs });
  } catch (e: any) {
    console.error(e);
    return res.status(400).json({ error: e });
  }
}