// imports
const Discord = require('discord.js')
const Timer = require('timer-machine')
const fs = require('fs')
const humanize = require('humanize-duration')
require('dotenv').config()
require('enve')
// files
const files = {
  user: {
    fileName: process.enve.USERFILE,
    json: require(process.enve.USERFILE)
  },
  stat: {
    fileName: process.enve.STATFILE,
    json: require(process.enve.STATFILE)
  }
}

// create client
const client = new Discord.Client()

client.on('ready', () => {
  console.log('Ready')
  client.user.setPresence({ // set presence
    game: { name: process.enve.NAME },
    status: process.enve.STATUS
  })
})

// login
client.login(process.enve.TOKEN)

// trigger on voice status change
client.on('voiceStateUpdate', function (oldState, newState) {
  const userID = oldState.id // set up userID
  if (newState.channelID === null) { // case for disconnect
    var timer = Timer.get(userID) // end timer
    timer.stop()
    addStat(userID, timer.time()) // send to stat handler
    Timer.destroy(userID)
  // case for connect
  } else { Timer.get(userID).start() } // start new timer
})

client.on('message', message => {
  const prefix = process.enve.PREFIX // set prefix
  if (!message.author.bot && message.content.startsWith(prefix)) { // check if sent by self & check for prefix
    const args = message.content.slice(prefix.length).split(' ') // split
    const command = args.shift().toLowerCase()
    // check validity of commands
    if (command === 'stats') {
      prefetch(message.guild)
      message.channel.send(retreiveStat()) // retreive all stats
    } else if (command === 'prefetch') {
      prefetch(message.guild)
    } else {
      return 'invalid command'
    }
  }
})

async function prefetch (guild) {
  // files
  var userFile = files.user.json
  for (var id in files.stat.json) { // iterate over members in stats
    guild.members.fetch(id)
      .then(res => { // assign usernames and write
        userFile[id] = res.user.username
        fileWriter(files.user.fileName, userFile)
      })
  }
}

// get stats from file
function retreiveStat () {
  // empty message
  var message = ''
  for (var id in files.stat.json) {
    // nickname : humanizedTime \n
    message += (files.user.json[id] + ' : ' + humanize(files.stat.json[id]) + '\n')
  }
  return message
}

function fileWriter (filename, json) {
  fs.writeFile(filename, JSON.stringify(json), function (err) {
    if (err) throw err
  })
}

function addStat (id, time) {
  var statFile = files.stat.json
  // add time
  if (isNaN(statFile[id])) { // check for invalid/ zero time
    statFile[id] = time
  } else {
    statFile[id] += time
  }
  fileWriter(files.stat.fileName, statFile) // write to json
}
