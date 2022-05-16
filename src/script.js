// -- Modules
const Parser = require('rss-parser');
const parser = new Parser();
const fs = require('fs');
const { Webhook, MessageBuilder } = require('discord-webhook-node');
require('dotenv').config()
const processEnv = process.env

// -- Dont post first time script runs
const timeNow = Date.now();

let feeds = [];
Object.keys(processEnv).forEach(element => {
    if (element.startsWith("FEED_")) {
        feeds.push(process.env[element].split(', '));
    };
});

// -- Let them know its now looking for new posts!
console.log("The system is online!");

// -- Check RSS data
async function returnRssData(uri, webhook) {
    const feedLink = uri;
    const feedWebhook = webhook;
    const feed = await parser.parseURL(feedLink);
    const latestPost = feed.items[0];

    return { post: latestPost, webhook: feedWebhook };
};

// -- Check for new posts
async function checkSend(latestPost, file) {
    let oldPostDate = 0;
    try {
        oldPostDate = fs.readFileSync(`src/${file}.cache`, 'utf8');
        if (oldPostDate == "") {
            oldPostDate = 0;
        };
    } catch (err) {
        console.error(`Error reading src/${file}.cache, will default to '0'.`);
    };

    const latestPostDate = new Date(latestPost.post.isoDate).getTime();

    if ((latestPostDate > oldPostDate) && (latestPostDate > timeNow)) {
        oldPostDate = latestPostDate;
        fs.writeFileSync(`src/${file}.cache`, oldPostDate.toString());

        console.log("New post found!");

        return true;
    } else {
        console.log("No new posts found!");

        return false;
    };
};

// -- Actually send the message
async function sendDiscordMessage(latestPost) {
    const latestPostTitle = latestPost.post.title;
    const latestPostContent = (latestPost.post.content.substring(0, 101) + `...`).replace(/(\r\n|\n|\r)/gm, "");
    const latestPostLink = latestPost.post.link;

    console.log("Sending...");

    // -- Send it
    const hook = new Webhook(latestPost.webhook);
    const embed = new MessageBuilder()
        .setTitle(latestPostTitle)
        .setURL(latestPostLink)
        .setColor('#00f41c')
        .setDescription(latestPostContent)
        .setFooter('Created by Shadowwalker0408', 'https://github.com/shadowwalker0408/RssDiscordPoller')
        .setTimestamp();
    hook.send(embed);
};

async function main() {
    feeds.forEach(async element => {
        const uri = element[0];
        const webhook = element[1];
        const file = element[2];
        const latestPost = await returnRssData(uri, webhook);

        if (await checkSend(latestPost, file)) {
            sendDiscordMessage(latestPost);
        };
    });
};

// -- Poll every 5 minutes
setInterval(function() {
    main();
}, process.env.pollTime * 60 * 1000);
