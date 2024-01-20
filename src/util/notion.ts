import { Client } from "@notionhq/client";
import { EventDetails } from "./types";
import { QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";

export const getUuid = (page: string) => {
  // new URLSearchParams(page).
  const splitPage = page.split("-");
  return splitPage[splitPage.length - 1];
};

/**
 * Follow this format: https://www.notion.so/acmucsd/A-Deep-Dive-into-ChatGPT-480e5a4dac87467ba9da3fa41a2a4520
 * */
export const isValidNotionPage = (url: string): boolean => {
  const validate = url.match(/^https:\/\/www.notion.so\/.+-[\w\d]{32}$/g);
  return validate?.length === 1;
};

export const parseEventPage = (notionPage: any): EventDetails => {
  const props = notionPage.properties;

  const getPlainTextFromProp = (prop: any[]): string => {
    if (!Array.isArray(prop)) {
      return "";
    }
    return prop.length > 0 ? prop[0].plain_text : "";
  }

  const parseCommunity = (prop: any[]): string => {
    if (prop.length > 0) {
      const communities = prop.map(organization => {
        const name = organization.name.toLowerCase() as string;
        if (name.includes('cyber')) {
          return 'Cyber'
        } else if (name.includes('design')) {
            return 'Design'
        } else if (name.includes('hack')) {
          return 'Hack'
        } else if (name.includes('ai')) {
          return 'AI'
        }
        return null
      }).filter(c => c !== null) as string[];
      if (communities.length > 0) {
        return communities[0];
      }
    }
    return "General"
  }

  const eventDetails: EventDetails = {
    title: getPlainTextFromProp(props["Name"]?.title),
    community: parseCommunity(props["Organizations"]?.multi_select),
    location: props["Location"]?.select?.name ?? "",
    description:
      getPlainTextFromProp(props["Marketing Description"]?.rich_text) ||
      getPlainTextFromProp(props["Event Description"]?.rich_text),
    checkin: getPlainTextFromProp(props["Check-in Code"]?.rich_text),
    start: props["Date"]?.date?.start ?? "",
    end: props["Date"]?.date?.end ?? "",
    date: props["Date"]?.date,
    acmurl: props["Marketing ACMURL"]?.url ?? "",
  };

  return eventDetails;
};

const getNotionAPI = (): Client => {
  return new Client({ auth: process.env.NOTION_INTEGRATION_TOKEN })
}

export const getEventPageDetails = async (uuid: string) => {
  const notion = getNotionAPI();
  let page;
  try {
    page = await notion.pages.retrieve({ page_id: uuid });
  } catch (err) {
    throw new Error("Page Not Found");
  }
  let details;
  try {
    details = parseEventPage(page);
  } catch (err) {
    throw new Error("Event is missing required fields!");
  }
  return details;
};

export const getUpcomingCalendarEvents = async (): Promise<QueryDatabaseResponse> => {
  const notion = getNotionAPI();
  const calendar = await notion.databases.query({
    database_id: process.env.NOTION_EVENT_CALENDAR_DB_ID ?? "",
    page_size: 100,
    filter: {
      and: [
        {
          property: "Date",
          date: {
            after: new Date().toISOString(),
          },
        },
        {
          property: "Type",
          select: {
            does_not_equal: "Non-Event",
          },
        },
      ],
    },
  });
  return calendar;
};
