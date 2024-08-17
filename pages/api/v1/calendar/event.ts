import type { NextApiRequest, NextApiResponse } from "next";
import { calendar } from "@/util";
import type { Data } from "@/util/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  // Validate body provided
  if (!req.body) return res.status(400).json({ error: "No body provided" });
  
  // Validate request type
  switch (req.method) {
    case "POST":
      return post_handler(req, res);
    case "PATCH":
      return patch_handler(req, res);
    case "DELETE":
      return delete_handler(req, res);
    default:
      return res.status(405).json({ error: "Invalid request method" });
  }
}

async function post_handler(req: NextApiRequest, res: NextApiResponse<Data>) {
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
    const eventID = await calendar.createCalendarEvent(name, start, end, location, description, eventLink);
    return res.status(200).json({ message: `Event created with calendar ID: ${eventID}` });
  } catch (err) {
    return res.status(400).json({ error: JSON.stringify(err) });
  }
}

async function patch_handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { eventID, name, start, end, description, location, eventLink } = req.body;
  
  // Validate body values exist and are acceptable
  if (!eventID) return res.status(400).json({ error: "Missing required body field: eventID" });
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

  try {
    await calendar.editCalendarEvent(eventID, name, start, end, location, description, eventLink);
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
    await calendar.deleteCalendarEvent(eventID);

    return res.status(200).json({ message: `Event deleted with ID: ${eventID}` });
  } catch (err) {
    return res.status(400).json({ error: JSON.stringify(err) });
  }
}
