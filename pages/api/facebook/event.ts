// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  message: string;
};

/**
 * Create new Facebook Event
 * @param req
 * @param res
 */
export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method) res.status(200).json({ message: "API is active." });
}
