import type { Data } from "@/util/types";
import type { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
import { verifyAuth } from "@/util";
import * as multer from 'multer';

/**
 * 
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
  
  console.log("hihi")
  const file = await req.body.file as multer.file;
  console.log(file.name);
  return res.status(400).json({ error: "No body provided" });
  // try {
  //   // Try to upload the photo
  // } catch (e: any) {
    
  // }
}