// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createCalendarEvent } from "@/util";

type Data = {
  message: string;
};

const invalidMethod: any = { error: "Invalid request method" };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") return res.status(400).json(invalidMethod);

  if (!req.body) return res.status(400).json({ message: "No body provided" });
  const { name, start, end, description, location, eventLink } = req.body;

  if (!name)
    return res
      .status(400)
      .json({ message: "Missing required body field: name" });
  if (!start)
    return res
      .status(400)
      .json({ message: "Missing required body field: start" });
  if (!end)
    return res
      .status(400)
      .json({ message: "Missing required body field: end" });
  if (!description)
    return res
      .status(400)
      .json({ message: "Missing required body field: description" });
  if (!location)
    return res
      .status(400)
      .json({ message: "Missing required body field: location" });
  if (!eventLink)
    return res
      .status(400)
      .json({ message: "Missing required body field: eventLink" });
  if (new Date(start) < new Date())
    return res
      .status(400)
      .json({ message: "Start date cannot be in the past" });
  if (new Date(end) < new Date())
    return res.status(400).json({ message: "End date cannot be in the past" });

  try {
    await createCalendarEvent(
      name,
      start,
      end,
      location,
      description,
      eventLink
    );
    return res.status(200).json({ message: "Event created successfully!" });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: JSON.stringify(err) });
  }
}
