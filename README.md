# RSS-DISCORD-POLLER
## Description
Polls RSS feed every 5 minutes and if it finds a more recent announcement then it will post that in the selected discord channel using a webhook.
This project requires a `.env` file to be placed in the root directory.

## .env file setup:
```
pollTime=<time in minutes to poll for new feeds>
FEED_0x=<rssFeedLink, discordwebhook, title>
```
### .env file example:
```bash
pollTime=5
FEED_O1=rssFeedLink, discordWebhook, MyTitle
FEED_O2=otherRssFeedLink, otherDiscordWebhook, MyOtherTitle
```

## Building / Running
### Docker
You may use the attatched docker file and the command bellow to run this in a docker environment
```
docker build -t rss-discord-poller .

docker run -d \
  --restart=unless-stopped \
  --name rss-discord-poller \
  rss-discord-poller
```
### Other
Run the script.js file within the src folder.

## Licensing
Please view the attatched license file.
