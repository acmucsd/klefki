import { WebhookClient } from "discord.js";

const discordWebhook = {
  eventCreationPing(message: string, url: string) {
    const hook = new WebhookClient({ url: process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL as string });
    hook.send({
      content: `Paging <@&${process.env.NEXT_PUBLIC_DISCORD_MARKETING_ROLE_ID}>!`,
      embeds: [
        {
          title: message,
          description: `Please verify all details are correct: ${url}`,
        },
      ],
    });
  },
};

export default discordWebhook;
