import { NextApiRequest, NextApiResponse } from 'next';
import NextCors from "nextjs-cors";
import { sql } from '@vercel/postgres';
import { verifyAuth } from "@/util";
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await NextCors(req, res, {
    methods: ["GET"],
    origin: "*",
    optionsSuccessStatus: 200,
  });
//   try {
//     await verifyAuth(req);
//   } catch (err: any) {
//     return res.status(400).json({ error: err });
//   }

  // Validate body provided
  if (!req.body) return res.status(400).json({ error: "No body provided" });
  const { Name, Discord } = req.body;
  // Validate body values exist and are acceptable
  if (!Name && !Discord) return res.status(400).json({ error: "Missing required field: One field must be specified!" });

  try {
    if(Name){
        console.log("Name found")
        const row = await sql`SELECT * FROM Board WHERE name = ${Name};`;
        return res.status(200).json({ row });
    }
    else{
        console.log("discord found");
        const row = await sql`SELECT * FROM Board WHERE discord = ${Discord};`;
        return res.status(200).json({ row });
    }
  } catch (e: any) {
    return res.status(500).json({ e });
  }
}

