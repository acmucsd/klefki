import { calendar_v3, google } from "googleapis";

async function initializeCalendar(): Promise<calendar_v3.Calendar> {
  const auth = new google.auth.GoogleAuth({
    keyFilename: "./gapi-service-account-creds.json",
    scopes: [
      "https://www.googleapis.com/auth/calendar.readonly",
      "https://www.googleapis.com/auth/calendar",
    ],
  });
  const authClient = await auth.getClient();
  const calendar = google.calendar({ version: "v3", auth: authClient });
  return calendar;
}

export async function createCalendarEvent(
  title: string,
  startTime: string,
  endTime: string,
  location: string,
  description: string,
  eventLink: string,
): Promise<string | null | undefined> {
  const calendar = await initializeCalendar();
  const eventDescription = `${description}\n\nLocation: ${location}\nEvent Link: ${eventLink}`;
  
  const response = await calendar.events.insert({
    calendarId: process.env.GOOGLE_CALENDAR_ID,
    requestBody: {
      summary: title,
      description: eventDescription,
      location,
      start: {
        dateTime: startTime,
      },
      end: {
        dateTime: endTime,
      },
    },
  });
  
  return response?.data?.id;
}

export async function editCalendarEvent(
  eventId: string,
  title: string,
  startTime: string,
  endTime: string,
  location: string,
  description: string,
  eventLink: string,
): Promise<void> {
  const calendar = await initializeCalendar();
  const eventDescription = `${description}\n\nLocation: ${location}\nEvent Link: ${eventLink}`;
  
  await calendar.events.update({
    calendarId: process.env.GOOGLE_CALENDAR_ID,
    eventId,
    requestBody: {
      summary: title,
      description: eventDescription,
      location,
      start: {
        dateTime: startTime,
      },
      end: {
        dateTime: endTime,
      },
    },
  });
}



export async function deleteCalendarEvent(
  eventId: string,
): Promise<void> {
  const calendar = await initializeCalendar();
  
  await calendar.events.delete({
    calendarId: process.env.GOOGLE_CALENDAR_ID,
    eventId,
  });
}