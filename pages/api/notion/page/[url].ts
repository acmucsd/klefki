// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Client } from "@notionhq/client";
import { GetPageResponse } from "@notionhq/client/build/src/api-endpoints";
import type { NextApiRequest, NextApiResponse } from "next";

interface EventDetails {
  title: string;
  organization: string[];
  location: string;
  description: string;
  checkin: string;
  start: string;
  end: string;
  acmurl: string;
}

const invalidMethod: any = { error: "Invalid request method" };
const noPageProvided: any = { error: "No query param found for page" };
const invalidPage: any = { error: "Invalid Notion page URL" };
const pageNotFound: any = { error: "Notion page not found" };

const getUuid = (page: string) => {
  const splitPage = page.split("-");
  return splitPage[splitPage.length - 1];
};

/**
 * Follow this format: https://www.notion.so/acmucsd/A-Deep-Dive-into-ChatGPT-480e5a4dac87467ba9da3fa41a2a4520
 * */
const isValidNotionPage = (url: string): boolean => {
  const validate = url.match(/^https:\/\/www.notion.so\/acmucsd\/.+-[\w\d]{32}$/g);
  return validate?.length === 1;
};

const parseEventPage = (notionPage: any): EventDetails => {
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

type Data = EventDetails;

/**
 * Get Notion Page Event Details
 * @param req
 * @param res
 * @returns
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== "GET") return res.status(400).json(invalidMethod);

  const { url } = req.query;
  if (!url) return res.status(400).json(noPageProvided);

  const pageUrl = decodeURIComponent(url as string);
  if (isValidNotionPage(pageUrl) === false) return res.status(400).json(invalidPage);

  const notion = new Client({ auth: process.env.NEXT_PUBLIC_NOTION_INTEGRATION_TOKEN });

  let page: GetPageResponse;
  try {
    const pageUuid = getUuid(pageUrl);
    page = await notion.pages.retrieve({ page_id: pageUuid });
  } catch (err) {
    return res.status(400).send(pageNotFound);
  }

  const eventDetails = parseEventPage(page);
  return res.status(200).json(eventDetails);
}
