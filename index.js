const config = require('./config')
const { pageSetup, getParticipantsFromZoom, UdacityFlow, loginIntoZoom,
  loginIntoUdacity, fillAttendance
} = require('./logic')
const puppeteer = require('puppeteer')
const args = require('minimist')(process.argv.slice(2))

function setConfigValues () {
  config.Init(args['attendance-day'], process.env.ZOOM_EMAIL,
    process.env.ZOOM_PASSWORD, process.env.UDACITY_EMAIL,
    process.env.UDACITY_PASSWORD, process.env.DASHBOARD_URL)
}

function CheckRequiredFields () {
  const requiredKeys = ['zoom', 'udacity']
  for (const key of requiredKeys) {
    if (typeof config[key].EMAIL == 'undefined') {

      throw `${key.toUpperCase()}_EMAIL is required as env variable`
    }
    if (typeof config[key].PASSWORD == 'undefined') {
      throw `${key.toUpperCase()}_PASSWORD is required as env variable`
    }
  }

}

(async () => {
  setConfigValues()
  CheckRequiredFields(config)
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()
  await pageSetup(page)
  await loginIntoZoom(page,config)
  let participants = await getParticipantsFromZoom(page, config)
  await loginIntoUdacity(page,config)
  let notFoundPart = await fillAttendance(page, config,participants)
  console.log(`total participants: ${participants.length}`)
  console.table(participants)
  if (notFoundPart.length > 0) {
    console.log(
      `there are ${notFoundPart.length} out of ${participants.length} participants that didn't match over udacity `)
    console.table(notFoundPart)
  }
  await browser.close()

})()
