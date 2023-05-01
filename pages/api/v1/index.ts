import { StandardResponse } from "@/util/types";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(_: NextApiRequest, res: NextApiResponse<StandardResponse>) {
  res.status(200).json({ message: "API is active." });
}
