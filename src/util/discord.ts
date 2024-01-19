import { REST, WebhookClient } from "discord.js";

export const pingDiscordWebhook = (message: string, url: string) => {
  const hook = new WebhookClient({
    url: process.env.DISCORD_WEBHOOK_URL as string,
  });
  hook.send({
    content: `Paging <@&${process.env.DISCORD_MARKETING_ROLE_ID}>!`,
    embeds: [
      {
        title: message,
        description: `Please verify all details are correct: ${url}`,
      },
    ],
  });
};

export const createDiscordEvent = async (
  title: string,
  start: string,
  end: string,
  location: string,
  description: string
) => {
  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_BOT_TOKEN as string);

  const response = await rest.post(`/guilds/${process.env.ACM_GUILD_ID}/scheduled-events`, {
    body: {
      name: title,
      scheduled_start_time: start,
      scheduled_end_time: end,
      description,
      entity_metadata: {
        location,
      },
      entity_type: 3,
      privacy_level: 2,
    },
  });

  return response;
};

export const addCoverEvent = async (
  eventID: string,
  image: any,
) => {
  // Discord takes image in format: data:image/<extension>;base64,BASE64_ENCODED_IMAGE_DATA
  const imageUrlToBase64 = async (url: string) => {
    const data = await fetch(url);
    const blob = await data.arrayBuffer()
    const extRe = new RegExp("\.([0-9a-z]+)(?:[\?#]|$)", "i");
    const ext = extRe.exec(image);

    return `data:image/${ext};base64,${Buffer.from(blob).toString('base64')}`
  };

  var imageURI = (await imageUrlToBase64(image)).toString();

  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_BOT_TOKEN as string);
  const response = await rest.patch(`/guilds/${process.env.ACM_GUILD_ID}/scheduled-events/${eventID}`, {
      body: { image: imageURI, },
    }
  );

  return response;
}