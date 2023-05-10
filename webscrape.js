import axios from 'axios';
import { load } from 'cheerio';
import { EmbedBuilder } from 'discord.js';

const url = 'https://www.nscc.ca/study-at-nscc/student-supports/graduate-employment-services/searchresults.aspx?kw=&jt=&jc=11&loc=&jr=&dp=1';

// Scrape the NSCC job board
export default async function scrape() {
    const response = await axios.get(url)
    const html = response.data;
    const $ = load(html);
    const listings = [];

    $('.ges-list-listing').each((i, element) => {
        const titleLink = $(element).find('.ges-list-title a');
        const title = titleLink.text();
        const relativeLink = titleLink.attr('href');
        const link = `https://www.nscc.ca/study-at-nscc/student-supports/graduate-employment-services/${relativeLink}`;
        const location = $(element).find('.ges-list-location').text();
        const type = $(element).find('.ges-list-type').text().split(':')[1].trim();
        const postDate = $(element).find('.ges-list-post-date').text().split(':')[1].trim();
        const closeDate = $(element).find('.ges-list-close-date').text().split(':')[1].trim();

        listings.push({ title, link, location, type, postDate, closeDate });
    });

    return listings;
}
// Format the embed to be sent to Discord
export function formatEmbed(post) {
    const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle(post.title)
        .setDescription(post.location)
        .addFields(
            { name: 'Type', value: post.type, inline: false },
            { name: 'Post Date', value: post.postDate, inline: false },
            { name: 'Close Date', value: post.closeDate, inline: false },
        )
        .setURL(post.link)

    return embed;
}
// Check if the listing is valid by close date
export function isListingValid(oldMessages) {
    const closeDate = Date.parse(oldMessages.closeDate);
    const currentDate = new Date().getTime();
    return closeDate > currentDate;
}