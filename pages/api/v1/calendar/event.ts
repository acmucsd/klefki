import type { NextApiRequest, NextApiResponse } from "next";
import { calendar } from "@/util";
import type { Data } from "@/util/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  // Validate body provided
  if (!req.body) return res.status(400).json({ error: "No body provided" });
  
  // Validate request type
  switch (req.method) {
    case "POST":
      return createCalendarEvent(req, res);
    case "PATCH":
      return editCalendarEvent(req, res);
    case "DELETE":
      return deleteCalendarEvent(req, res);
    default:
      return res.status(405).json({ error: "Invalid request method" });
  }
}

async function createCalendarEvent(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { name, start, end, description, location, eventLink } = req.body;
  const validationError = validateBody(res, name, start, end, description, location, eventLink);
  if (validationError) return res.status(400).json({ error: validationError });

  // Create Google calendar event
  try {
    const eventID = await calendar.createCalendarEvent(name, start, end, location, description, eventLink);
    return res.status(200).json({ message: `Event created with calendar ID: ${eventID}` });
  } catch (err) {
    return res.status(400).json({ error: JSON.stringify(err) });
  }
}

async function editCalendarEvent(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { eventID, name, start, end, description, location, eventLink } = req.body;
  const validationError = validateBody(res, name, start, end, description, location, eventLink);
  if (validationError) return res.status(400).json({ error: validationError });
  if (!eventID) return res.status(400).json({ error: "Missing required body field: eventID" });

  // Edit Google calendar event
  try {
    await calendar.editCalendarEvent(eventID, name, start, end, location, description, eventLink);
    return res.status(200).json({ message: `Event modified with ID: ${eventID}` });
  } catch (err) {
    return res.status(400).json({ error: JSON.stringify(err) });
  }
}

async function deleteCalendarEvent(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { eventID } = req.body;

  // Validate body values exist and are acceptable
  if (!eventID) return res.status(400).json({ error: "Missing required body field: eventID" });

  // Delete Google calendar event
  try {
    await calendar.deleteCalendarEvent(eventID);

    return res.status(200).json({ message: `Event deleted with ID: ${eventID}` });
  } catch (err) {
    return res.status(400).json({ error: JSON.stringify(err) });
  }
}

function validateBody(res: NextApiResponse<Data>, name: string, start: string, end: string, description: string, location: string, eventLink: string): string | null {
  // Validate body values exist and are acceptable
  if (!name) return "Missing required body field: name";
  if (!start) return "Missing required body field: start";
  if (!end) return "Missing required body field: end";
  if (!description)
    return "Missing required body field: description";
  if (!location) return "Missing required body field: location";
  if (!eventLink) return "Missing required body field: eventLink";
  if (new Date(start) < new Date())
    return "Start date cannot be in the past";
  if (new Date(end) < new Date())
    return "End date cannot be in the past";

  return null;
}