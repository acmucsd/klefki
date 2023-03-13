import discordWebhook from "@/util";
import { REST } from "discord.js";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  message: any;
};

const invalidMethod: any = { error: "Invalid request method" };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== "POST") return res.status(400).json(invalidMethod);

  if (!req.body) return res.status(400).json({ message: "No body provided" });
  const { name, start, end, description, location, image } = req.body;

  if (!name) return res.status(400).json({ message: "Missing required body field: name" });
  if (!start) return res.status(400).json({ message: "Missing required body field: start" });
  if (!end) return res.status(400).json({ message: "Missing required body field: end" });
  if (!description)
    return res.status(400).json({ message: "Missing required body field: description" });
  if (!location) return res.status(400).json({ message: "Missing required body field: location" });
  if (new Date(start) < new Date())
    return res.status(400).json({ message: "Start date cannot be in the past" });
  if (new Date(end) < new Date())
    return res.status(400).json({ message: "End date cannot be in the past" });

  const rest = new REST({ version: "10" }).setToken(
    process.env.NEXT_PUBLIC_DISCORD_BOT_TOKEN as string
  );

  try {
    const response: any = await rest.post(
      `/guilds/${process.env.NEXT_PUBLIC_ACM_GUILD_ID}/scheduled-events`,
      {
        body: {
          name,
          scheduled_start_time: start,
          scheduled_end_time: end,
          description,
          image,
          entity_metadata: {
            location,
          },
          entity_type: 3,
          privacy_level: 2,
        },
      }
    );
    const eventID = response.id as string;

    discordWebhook.eventCreationPing(
      ":bangbang: New Discord Event Created :bangbang:",
      `${process.env.NEXT_PUBLIC_ACM_DISCORD_INVITE_URL}?event=${eventID}`
    );

    return res.status(200).json({ message: "Event created successfully!" });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: err });
  }
}
