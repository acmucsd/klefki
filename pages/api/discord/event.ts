import { discord } from "@/util";
import type { Data } from "@/util/types";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  // Validate POST request type
  if (req.method !== "POST") return res.status(400).json({ error: "Invalid request method" });

  // Validate body provided
  if (!req.body) return res.status(400).json({ error: "No body provided" });
  const { name, start, end, description, location, image } = req.body;

  // Validate body values exist and are acceptable
  if (!name) return res.status(400).json({ error: "Missing required body field: name" });
  if (!start) return res.status(400).json({ error: "Missing required body field: start" });
  if (!end) return res.status(400).json({ error: "Missing required body field: end" });
  if (!description)
    return res.status(400).json({ error: "Missing required body field: description" });
  if (!location) return res.status(400).json({ error: "Missing required body field: location" });
  if (new Date(start) < new Date())
    return res.status(400).json({ error: "Start date cannot be in the past" });
  if (new Date(end) < new Date())
    return res.status(400).json({ error: "End date cannot be in the past" });

  // Create Discord event
  try {
    const response: any = await discord.createDiscordEvent(name, start, end, location, description);
    const eventID = response.id as string;
    discord.pingDiscordWebhook(
      ":bangbang: New Discord Event Created :bangbang:",
      `${process.env.ACM_DISCORD_INVITE_URL}?event=${eventID}`
    );

    return res.status(200).json({ message: "Event created successfully!" });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: JSON.stringify(err) });
  }
}
