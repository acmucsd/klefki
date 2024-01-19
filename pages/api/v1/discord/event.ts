import { discord, verifyAuth } from "@/util";
import type { Data } from "@/util/types";
import type { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";

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

  // Validate body provided
  if (!req.body) return res.status(400).json({ error: "No body provided" });
  const { title, start, end, description, location, image } = req.body;

  // Validate body values exist and are acceptable
  if (!title) return res.status(400).json({ error: "Missing required body field: title" });
  if (!start) return res.status(400).json({ error: "Missing required body field: start" });
  if (!end) return res.status(400).json({ error: "Missing required body field: end" });
  if (!description)
    return res.status(400).json({ error: "Missing required body field: description" });
  if (!location) return res.status(400).json({ error: "Missing required body field: location" });
  if (new Date(start) < new Date())
    return res.status(400).json({ error: "Start date cannot be in the past" });
  if (new Date(end) < new Date())
    return res.status(400).json({ error: "End date cannot be in the past" });

  // Discord only accepts gif/jpeg/png for cover images on scheduled events
  const discordImageTypes = ['gif', 'jpeg', 'jpg', 'png'];
  const ext = image.toString().split('.').pop();
  if (!discordImageTypes.includes(ext))
    return res.status(400).json({ error: "Cover image must be a gif, jpeg, or png"});

  // Create Discord event
  try {
    const response: any = await discord.createDiscordEvent(
      title,
      start,
      end,
      location,
      description
    );
    const eventID = response.id as string;
    discord.pingDiscordWebhook(
      ":bangbang: New Discord Event Created :bangbang:",
      `${process.env.ACM_DISCORD_INVITE_URL}?event=${eventID}`
    );
    
    // Add cover image, if included
    var cover = ""
    if(image){
      await discord.addCoverEvent(
        eventID,
        image,
      );
    }
    else cover = ", without a cover image";

    return res.status(200).json({ message: `Event created successfully${cover}!` });
  } catch (err) {
    return res.status(400).json({ error: JSON.stringify(err) });
  }
}
