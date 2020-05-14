# discord-vc-timetracker

To prove a point about being in discord call(s) longer
  - Tracks total time across channels visible to bot
  - Tracks time per user ID
  - Displays total time with usernames
  - Assumes single-guild configuration

## Usage
!stats: display all stats  
!prefetch: prefetch usernames to avoid "undefined" errors

dependencies: [discord.js](discord.js.org), [dotenv](https://www.npmjs.com/package/dotenv), [timer-machine](https://www.npmjs.com/package/timer-machine), [humanize-duration](humanize-duration)

## Invite link
https://discordapp.com/oauth2/authorize?client_id=`client-id-here`&scope=bot&permissions=1024

Permissions:  
View Channels + Read Messages

## Config
 `name:` Name the bot whatever you want  
 `status:` status of bot - `online`, `idle`, `invisible`, `dnd`  
 `token`: your super secret token from [discord](https://discordapp.com/developers/applications/)  
 `prefix`: your desired prefix for the bot to respond to  
 `statfile`: json file for stats  
 `userfile`: json file for fetched usernames from IDs
