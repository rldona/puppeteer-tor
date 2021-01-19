# filmaffinity-scrapper-etl

POC: using puppeteer how batch process

# Project Filmaffinity Scrapper:

- filmaffinity-project-etl
- filmaffinity-project-function
- filmaffinity-project-api

# PM2 Commands

## Long process
- pm2 start --name scrapper-es ./src/batch-long.js -- es 100000 1000000
- pm2 start --name scrapper-en ./src/batch-long.js -- en 100000 1000000

## Short process
- pm2 start --name updater-es ./src/batch-short.js -- es
- pm2 start --name updater-en ./src/batch-short.js -- en