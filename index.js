// imports
import * as dotenv from 'dotenv';
import scrape, { formatEmbed, isListingValid } from './webscrape.js';
import { Client, Events, GatewayIntentBits } from 'discord.js';
import sendMessage from './sendMessage.js';
import saveData, { loadData } from './fileSystem.js';
import cron from 'node-cron';

// Load environment variables from .env file
dotenv.config();
const token = process.env.TOKEN;
// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the bot is ready, scheduled tasks will run
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
	cron.schedule('0 0 10,18 * * * *', runEverything);
});

// Log in to Discord with your client's token
client.login(token);

// Async function to run scrape, send messages, and save data
async function runEverything() {
	console.log('Running scheduled tasks...');
	const oldMessageData = await loadData();
	const expired = oldMessageData.filter(m => !isListingValid(m));
	for (const m of expired) {
		const channel = client.channels.cache.get(process.env.CHANNELID);
		channel.messages.delete(m.messageId);
		console.log(`Deleted message ${m.messageId}`);
	}
	const sentMessages = oldMessageData.filter(isListingValid);
	const posts = await scrape();
	const messages = [...sentMessages];
	for (const post of posts) {
		if (!!sentMessages.find(m => m.link === post.link)) continue;
		const formatted = formatEmbed(post);
		const messageId = await sendMessage(client, formatted);
		messages.push({ messageId, link: post.link, closeDate: post.closeDate });
	}
	saveData(messages);
}