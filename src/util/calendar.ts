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
  eventLink: string
): Promise<void> {
  const calendar = await initializeCalendar();
  const eventDescription = `${description}\n\nLocation: ${location}\nEvent Link: ${eventLink}`;
  try {
    const response = await calendar.events.insert({
      calendarId: process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID,
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
    console.log(response);
  } catch (err) {
    console.error(err);
  }
}
