import type { Data } from "@/util/types";
import type { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
import { verifyAuth } from "@/util";
import { NextRequest } from "next/server";

export const config = {
  api: {
      bodyParser: false,
  },
};

/**
 * 
 */
export async function POST(req: NextApiRequest, res: NextApiResponse<Data>) {
  // await NextCors(req, res, {
  //   methods: ["POST"],
  //   origin: "*",
  //   optionsSuccessStatus: 200,
  // });

  try {
    await verifyAuth(req);
  } catch (err: any) {
    return res.status(400).json({ error: err });
  }
  
  console.log("hihi")
  const form = await req.formData();
  console.log(form)
}