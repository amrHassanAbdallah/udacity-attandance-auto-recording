const config = require('./config')
const { pageSetup, getParticipantsFromZoom, UdacityFlow } = require('./logic')
const puppeteer = require('puppeteer');
const args = require('minimist')(process.argv.slice(2))

function setConfigValues(){
  config.attendanceDate = args['attendance-day']
  if(typeof config.attendanceDate == "undefined"){
    let d = new Date()
    config.attendanceDate = `${d.getMonth()+1}/${d.getDate()}/${d.getFullYear()}`
  }

  config.zoom.EMAIL = process.env.ZOOM_EMAIL;
  config.zoom.PASSWORD = process.env.ZOOM_PASSWORD;

  config.udacity.EMAIL = process.env.UDACITY_EMAIL;
  config.udacity.PASSWORD = process.env.UDACITY_PASSWORD;

  config.udacity.loginURL = process.env.DASHBOARD_URL
}
(async () => {
  setConfigValues()
  config.CheckRequiredFields()
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()
  await pageSetup(page)
  let participants = await getParticipantsFromZoom(config, page)
  await UdacityFlow(config, page, participants)

  await browser.close()

})()
