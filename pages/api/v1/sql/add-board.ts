import { NextApiRequest, NextApiResponse } from 'next';
import NextCors from "nextjs-cors";
import { sql } from '@vercel/postgres';
import { verifyAuth } from "@/util";
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await NextCors(req, res, {
    methods: ["POST"],
    origin: "*",
    optionsSuccessStatus: 200,
  });
  // try {
  //   await verifyAuth(req);
  // } catch (err: any) {
  //   return res.status(400).json({ error: err });
  // }

  // Validate body provided
  if (!req.body) return res.status(400).json({ error: "No body provided" });
  const { Name, Discord } = req.body;
  // Validate body values exist and are acceptable
  if (!Name) return res.status(400).json({ error: "Missing required body field: Name" });
  if (!Discord) return res.status(400).json({ error: "Missing required body field: Discord" });


  try {
    // Add to DB
    await sql`INSERT INTO Board (Name, Discord) VALUES (${Name}, ${Discord});`;
    return res.status(200).json({ message: `Board Member ${Name} added.` });
  } catch (e: any) {
    return res.status(500).json({ e });
  }
}

