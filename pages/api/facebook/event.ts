import type { Data } from "@/util/types";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * TODO
 * @param req
 * @param res
 */
export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  res.status(200).json({ message: "Not implemented yet" });
}
