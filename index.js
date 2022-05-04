const config = require('./config')
const { pageSetup, getParticipantsFromZoom, UdacityFlow } = require('./logic')
const puppeteer = require('puppeteer');

(async () => {
  config.CheckRequiredFields()
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()
  await pageSetup(page)
  let participants = await getParticipantsFromZoom(config, page)
  await UdacityFlow(config, page, participants)

  await browser.close()

})()
