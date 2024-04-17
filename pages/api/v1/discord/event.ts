import { discord, verifyAuth } from "@/util";
import { getImageExtension, imageUrlToBase64 } from "@/util/discord";
import type { Data } from "@/util/types";
import type { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  await NextCors(req, res, {
    methods: ["POST", "PATCH", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200,
  });

  try {
    await verifyAuth(req);
  } catch (err: any) {
    return res.status(400).json({ error: err });
  }

  // Ensure body exists
  if (!req.body) return res.status(400).json({ error: "No body provided" });

  switch (req.method) {
    case "POST":
      return post_handler(req, res);
    case "PATCH":
      return patch_handler(req, res);
    case "DELETE":
      return delete_handler(req, res);
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}

async function post_handler(req: NextApiRequest, res: NextApiResponse<Data>) {
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

  let imageUpload = undefined;
  if (image) {
    // Discord only accepts gif/jpeg/png for cover images on scheduled events
    const discordImageTypes = ['gif', 'jpeg', 'jpg', 'png'];
    const extension = getImageExtension(image)
    if (!discordImageTypes.includes(extension)) {
      return res.status(400).json({ error: "Cover image must be a gif, jpeg, or png" });
    } else {
      imageUpload = await imageUrlToBase64(image);
    } 
  }

  // Create Discord event
  try {
    const response: any = await discord.createDiscordEvent(
      title,
      start,
      end,
      location,
      description,
      imageUpload
    );
    const eventID = response.id as string;
    discord.pingDiscordWebhook(
      ":bangbang: New Discord event created!",
      `${process.env.ACM_DISCORD_INVITE_URL}?event=${eventID}`,
      title, location
    );

    return res.status(200).json({ message: `Event created with ID: ${eventID}` });
  } catch (err) {
    return res.status(400).json({ error: JSON.stringify(err) });
  }
}

async function patch_handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (!req.body) return res.status(400).json({ error: "No body provided" });
  const { eventID, title, start, end, description, location, image } = req.body;

  // Validate body values exist and are acceptable
  if (!eventID) return res.status(400).json({ error: "Missing required body field: eventID" });
  if (start && new Date(start) < new Date())
    return res.status(400).json({ error: "Start date cannot be in the past" });
  if (start && new Date(end) < new Date())
    return res.status(400).json({ error: "End date cannot be in the past" });

  try {
    await discord.editDiscordEvent(eventID, title, start, end, description, location, image);
    discord.pingDiscordWebhook(
      ":bangbang: Discord event modified!",
      `${process.env.ACM_DISCORD_INVITE_URL}?event=${eventID}`,
      title, location
    );

    return res.status(200).json({ message: `Event modified with ID: ${eventID}` });
  } catch (err) {
    return res.status(400).json({ error: JSON.stringify(err) });
  }
}

async function delete_handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { eventID } = req.body;

  // Validate body values exist and are acceptable
  if (!eventID) return res.status(400).json({ error: "Missing required body field: eventID" });

  try {
    await discord.deleteDiscordEvent(eventID);
    discord.pingDiscordWebhook(":bangbang: Discord event deleted!");

    return res.status(200).json({ message: `Event deleted with ID: ${eventID}` });
  } catch (err) {
    return res.status(400).json({ error: JSON.stringify(err) });
  }
}