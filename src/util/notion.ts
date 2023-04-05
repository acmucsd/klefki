import { Client } from "@notionhq/client";
import { EventDetails } from "./types";

export const getUuid = (page: string) => {
  const splitPage = page.split("-");
  return splitPage[splitPage.length - 1];
};

/**
 * Follow this format: https://www.notion.so/acmucsd/A-Deep-Dive-into-ChatGPT-480e5a4dac87467ba9da3fa41a2a4520
 * */
export const isValidNotionPage = (url: string): boolean => {
  const validate = url.match(/^https:\/\/www.notion.so\/acmucsd\/.+-[\w\d]{32}$/g);
  return validate?.length === 1;
};

export const parseEventPage = (notionPage: any): EventDetails => {
  const props = notionPage.properties;

  const eventDetails: EventDetails = {
    title: props["Name"]?.title[0]?.plain_text ?? "",
    organization: props["Organizations"]?.multi_select?.map((option: any) => option.name) ?? "",
    location: props["Location"]?.select?.name ?? "",
    description:
      props["Marketing Description"]?.rich_text[0]?.plain_text ??
      props["Event Description"]?.rich_text[0]?.plain_text ??
      "",
    checkin: props["Check-in Code"]?.rich_text[0].plain_text ?? "",
    start: props["Date"]?.date?.start ?? "",
    end: props["Date"]?.date?.end ?? "",
    acmurl: props["FB ACMURL"]?.url ?? "",
  };

  return eventDetails;
};

export const getEventPageDetails = async (uuid: string) => {
  const notion = new Client({ auth: process.env.NEXT_PUBLIC_NOTION_INTEGRATION_TOKEN });
  const page = await notion.pages.retrieve({ page_id: uuid });
  const details = parseEventPage(page);
  return details;
};
