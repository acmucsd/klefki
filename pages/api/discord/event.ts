// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  message: string;
};

const invalidMethod: any = { error: "Invalid request method" };

/**
 * Create new Discord Event
 * @param req
 * @param res
 */
export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== "POST") return res.status(400).json(invalidMethod);

  if (req.method) res.status(200).json({ message: "API is active." });
}
