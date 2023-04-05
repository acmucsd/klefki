import { REST, WebhookClient } from "discord.js";

export const pingDiscordWebhook = (message: string, url: string) => {
  const hook = new WebhookClient({
    url: process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL as string,
  });
  hook.send({
    content: `Paging <@&${process.env.NEXT_PUBLIC_DISCORD_MARKETING_ROLE_ID}>!`,
    embeds: [
      {
        title: message,
        description: `Please verify all details are correct: ${url}`,
      },
    ],
  });
};

export const createDiscordEvent = async (
  name: string,
  start: string,
  end: string,
  location: string,
  description: string,
  image?: string
) => {
  const rest = new REST({ version: "10" }).setToken(
    process.env.NEXT_PUBLIC_DISCORD_BOT_TOKEN as string
  );

  const response = await rest.post(
    `/guilds/${process.env.NEXT_PUBLIC_ACM_GUILD_ID}/scheduled-events`,
    {
      body: {
        name,
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
    }
  );

  return response;
};
