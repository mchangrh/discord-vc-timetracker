// imports
const TimerMachine = require('timer-machine')
const fs = require('fs')
const path = require('path')
const strings = require('./strings.json') // strings
const humanize = require('humanize-duration')
// files
const statPath = path.join(__dirname, '..', 'stores', 'stats.json')
const statJson = require(statPath)
const userPath = path.join(__dirname, '..', 'stores', 'usernames.json')
const userJson = require(userPath)

// exports
module.exports = {
  timer: {
    stop: timerStop,
    start: timerStart,
    get: timerGet,
    getTime: timerGetTime
  },
  stat: {
    add: statAdd,
    retreive: statRetreive,
    record: statRecord
  },
  prefetch: prefetch
}

// timer functions

function timerStop (userID) { // stop timer
  var timer = timerGet(userID)
  timer.stop()
  statAdd(userID, timer.time())
  TimerMachine.destroy(userID)
  return strings.recordSuccessful
}

function timerGet (userID) { return TimerMachine.get(userID) } // get timer object
function timerStart (userID) { return timerGet(userID).start() } // start timer

function timerGetTime (message, args) { // get current call time
  const userID = (args.length) // args if specified or message author
    ? args
    : message.author.id
  var timer = timerGet(userID)
  // if timer is running return time, if not, return error string
  return (timer.isStarted())
    ? humanize(timer.time())
    : strings.err.noTimerRunning
}

// stat functions

function statAdd (id, time) { // add stat to file
  var stat = statJson
  isNaN(stat[id]) // add time if time exists
    ? stat[id] = time
    : stat[id] += time
  fileWriter(statPath, stat) // write to json
}

function statRetreive () { // get stats from file
  if (Object.keys(statJson).length) { // check for non-empty json
    var message = ''
    for (var id in statJson) {
      // nickname : humanizedTime \n
      message += `${userJson[id]} : ${humanize(statJson[id])}\n`
    }
    return message
  } else {
    return strings.err.noStat // if empty return noStat
  }
}

function statRecord (message, args) { // record current time
  console.log(args)
  const userID = (args.length) // args if specified or message author
    ? args
    : message.author.id
  var timer = timerGet(userID) // end timer
  // if timer is valid, stop. If not, send error string
  return (timer.isStarted())
    ? timerStop(userID)
    : strings.err.noTimerRunning
}

async function prefetch (guild) { // prefetch usernames
  var userFile = userJson
  var promises = []
  // iterate over members in stats
  for (var id in statJson) {
    promises.push(guild.members.fetch(id)
      .then(res => { userFile[id] = res.user.username }))
  }
  await Promise.all(promises) // await promises
  fileWriter(userPath, userFile)
  return strings.userFetched
}

function fileWriter (filename, json) { // write to file
  fs.writeFile(filename, JSON.stringify(json), function (err) {
    if (err) throw err
  })
}
