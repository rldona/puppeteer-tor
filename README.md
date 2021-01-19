# filmaffinity-scrapper-etl

POC: using puppeteer how batch process

# Project Filmaffinity Scrapper:

- filmaffinity-project-etl
- filmaffinity-project-function
- filmaffinity-project-api

# PM2 Commands

## Scrapper long process

- pm2 start --name scrapper-es ./src/batch-long.js -- es 100000 1000000
- pm2 start --name scrapper-en ./src/batch-long.js -- en 100000 1000000

## Updater short process

- pm2 start --name updater-es ./src/batch-short.js -- es
- pm2 start --name updater-en ./src/batch-short.js -- en

## Updater short process with cron time

### “At 00:00 on Monday.”
- pm2 start --name updater-es ./src/batch-short.js --cron "0 0 * * 1" -- es