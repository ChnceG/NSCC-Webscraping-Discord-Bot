import dotenv from 'dotenv';
import { Client, Events, GatewayIntentBits } from 'discord.js';

// send a message to a channel
export default async function sendMessage(client, embed) {
    const channelId = process.env.CHANNELID;
    const channel = client.channels.cache.get(channelId);
    try {
        const { id } = await channel.send({ embeds: [embed] });
        console.log('Message sent successfully.');
        return id;
    } catch (error) {
        console.error(`Failed to send message: ${error}`);
    }
}
