import { REST, WebhookClient } from "discord.js";

export const getImageExtension = (imageLink: string): string => {
  const extensionRegex = new RegExp("\.([0-9a-z]+)(?:[\?#]|$)", "i");
  const extensionMatch = extensionRegex.exec(imageLink);
  if (extensionMatch  && extensionMatch.length > 1) {
    return extensionMatch[1].toString().toLowerCase()
  }
  return '';
}

export const imageUrlToBase64 = async (url: string) => {
  // Discord takes images in the format: data:image/<extension>;base64,BASE64_ENCODED_IMAGE_DATA
  const data = await fetch(url);
  const blob = await data.arrayBuffer()
  const extension = getImageExtension(url)

  return `data:image/${extension};base64,${Buffer.from(blob).toString('base64')}`
};

export const pingDiscordWebhook = (message: string, url: string, title: string, location: string) => {
  const hook = new WebhookClient({
    url: process.env.DISCORD_WEBHOOK_URL as string,
  });
  hook.send({
    content: `Paging <@&${process.env.DISCORD_MARKETING_ROLE_ID}>!`,
    embeds: [
      {
        title: message,
        description: `**Event title**: ${title}\n**Location**: ${location}\n**Link**: ${url}`,
      },
    ],
  });
};

export const createDiscordEvent = async (
  title: string,
  start: string,
  end: string,
  location: string,
  description: string,
  image?: string
) => {
  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_BOT_TOKEN as string);

  const response = await rest.post(`/guilds/${process.env.ACM_GUILD_ID}/scheduled-events`, {
    body: {
      name: title,
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
  });

  return response;
};