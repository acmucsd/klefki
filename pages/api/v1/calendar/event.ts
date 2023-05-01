import type { NextApiRequest, NextApiResponse } from "next";
import { calendar } from "@/util";
import type { Data } from "@/util/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  // Validate POST request type
  if (req.method !== "POST") return res.status(400).json({ error: "Invalid request method" });

  // Validate body provided
  if (!req.body) return res.status(400).json({ error: "No body provided" });
  const { name, start, end, description, location, eventLink } = req.body;

  // Validate body values exist and are acceptable
  if (!name) return res.status(400).json({ error: "Missing required body field: name" });
  if (!start) return res.status(400).json({ error: "Missing required body field: start" });
  if (!end) return res.status(400).json({ error: "Missing required body field: end" });
  if (!description)
    return res.status(400).json({ error: "Missing required body field: description" });
  if (!location) return res.status(400).json({ error: "Missing required body field: location" });
  if (!eventLink) return res.status(400).json({ error: "Missing required body field: eventLink" });
  if (new Date(start) < new Date())
    return res.status(400).json({ error: "Start date cannot be in the past" });
  if (new Date(end) < new Date())
    return res.status(400).json({ error: "End date cannot be in the past" });

  // Create Google calendar event
  try {
    await calendar.createCalendarEvent(name, start, end, location, description, eventLink);
    return res.status(200).json({ message: "Event created successfully!" });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: JSON.stringify(err) });
  }
}
