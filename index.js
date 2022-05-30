const config = require('./config')
const { pageSetup, getParticipantsFromZoom, UdacityFlow } = require('./logic')
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
    if (typeof this[key].EMAIL == 'undefined') {

      throw `${key.toUpperCase()}_EMAIL is required as env variable`
    }
    if (typeof this[key].PASSWORD == 'undefined') {
      throw `${key.toUpperCase()}_PASSWORD is required as env variable`
    }
  }

}

(async () => {
  setConfigValues()
  CheckRequiredFields()
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()
  await pageSetup(page)
  let participants = await getParticipantsFromZoom(config, page)
  await UdacityFlow(config, page, participants)

  await browser.close()

})()
