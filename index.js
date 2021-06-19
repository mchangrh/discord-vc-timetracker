// imports
require('dotenv').config()
const Discord = require('discord.js')
const strings = require('./src/strings.json') // strings
const helper = require('./src/helper.js') // helper
// timer

const client = new Discord.Client() // create client
client.on('ready', () => {
  console.log('Ready')
  client.user.setPresence({ // set presence
    activity: { type: process.enve.ACT_TYPE, name: process.enve.ACT_NAME },
    status: process.enve.STATUS
  })
})
client.login(process.enve.TOKEN) // login

// trigger on voice status change
client.on('voiceStateUpdate', function (oldState, newState) {
  const userID = newState.id
  newState.channelID === null // new channel disconnect
    ? helper.timer.stop(userID)
    : helper.timer.start(userID)
})

client.on('message', message => {
  const prefix = process.enve.PREFIX // set prefix
  if (!message.author.bot && message.content.startsWith(prefix)) { // check if sent by self & check for prefix
    var args = message.content.slice(prefix.length).split(' ') // split
    const command = args.shift().toLowerCase()
    var response
    // run appropiate command
    if (command === 'prefetch') { // prefetch username
      helper.prefetch(message.guild)
      response = strings.runningPrefetch
    } else if (command === 'stats') { // print all stats
      helper.prefetch(message.guild)
      response = helper.stat.retreive()
    } else if (command === 'time') { // current timer
      response = helper.timer.getTime(message, args)
    } else if (command === 'record') { // record current time to quit
      response = helper.stat.record(message, args)
    } else {
      response = strings.err.invalidCommand
    }
    message.channel.send(response)
  }
})
