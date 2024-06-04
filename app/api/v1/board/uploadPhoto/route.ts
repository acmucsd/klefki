import type { Data } from "@/util/types";
import type { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
import * as multer from "multer";
import { NextRequest, NextResponse } from "next/server";
import { upload } from "@/util/board";
import { verifyAuth } from "@/util";

export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * 
 */
export async function POST(req: NextRequest) {
  // await NextCors(req, res, {
  //   methods: ["POST"],
  //   origin: "*",
  //   optionsSuccessStatus: 200,
  // });

  // try {
  //   await verifyAuth(req);
  // } catch (err: any) {
  //   return res.status(400).json({ error: err });
  // }
  
  const form = await req.formData();
  const file = form.get('file') as File;
  console.log(file);
  const url = await upload(file, file.name);

  return NextResponse.json({ url: url }, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}