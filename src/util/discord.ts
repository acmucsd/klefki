import { REST, WebhookClient } from "discord.js";

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
