async function loginIntoZoom (page, config) {
  try {
    await page.goto(config.GetZoomLoginURL())
    await page.waitForTimeout(3000)
    const isAlreadyLoggedIn = await page.evaluate(() => {
      return document.querySelector('#email') == null
    })
    if (!isAlreadyLoggedIn){
      await page.waitForSelector('div.signin button')
      await page.type('#email', config.GetZoomEmail())
      await page.type('#password', config.GetZoomPassword())
      await page.click('div.signin button')
      await page.waitForSelector('#app')
    }
  }catch (e) {
    console.log(e)
    throw new Error("Failed to login to zoom, make sure that you entered valid credentials")
  }
}

async function getParticipantsFromZoom (page, config) {
  //get the report data
  await page.goto(
    config.GetZoomReportsURL() +
    getReportsParamsArgs(config.GetAttendanceDay()))
  try {
    await page.waitForSelector('a[data-attendees]')
  } catch (error) {
    console.log(error)
    throw new Error('No zoom participants records found in this \'' + config.GetAttendanceDay() +
      '\' date, or the page took too long to load.')
  }
  await page.click(`a[data-attendees]`)
  await page.waitForSelector('div.modal-body table tr:nth-child(2)')

  await page.evaluate(() => {
    document.querySelector('#selectUnique').click()
  })

  await page.waitForSelector('div.modal-body table tr:nth-child(2)')

  return page.evaluate(() => {
    let participants = []
    let rows = document.querySelectorAll('div.modal-body table tr')
    for (let i = 1; i < rows.length; i++) {
      let cells = rows[i].cells
      let participant = {
        name: cells[0].innerText.toLowerCase().replace(/[&\/\\#,+()$~%!.„'":*‚^_¤?<>|@ª{«»§}©®™ ]/g, ' '),
        email: cells[1].innerText,
        duration: cells[2].innerText,
      }
      participants.push(participant)
    }
    return participants
  })
}

async function bulkParticipantsSelection (page, participants) {
  await page.waitForSelector('div.vds-text-input input')
  await page.waitForSelector('section table tr:nth-child(1)')

  let notFoundPart = await page.evaluate((participants) => {
    let notFoundPart = []
    let allATags = document.querySelectorAll('section table td a')
    let mappedTags = {}
    allATags.forEach(tag => {
      mappedTags[tag.innerText.toLowerCase().trim()] = tag
    })

    for (const participant of participants) {
      let val = mappedTags[participant.name.toLowerCase().trim()]
      if (val) {
        let input = val.parentElement.parentElement.querySelector('input')
        if (!input.checked) {
          input.click()
        }
      } else {
        notFoundPart.push(participant)
      }
    }
    return notFoundPart

  }, participants)
  return notFoundPart
}

async function bulkSelectUsingSearch (page, notFoundPart) {
  for (let i = 0; i < notFoundPart.length; i++) {
    let participant = notFoundPart[i]
    await page.type('div.vds-text-input input', participant.name)
    let isFound = await page.evaluate(() => {
      let input = document.querySelector('section table td:nth-child(1) input')
      if (input) {
        if (!input.checked) {
          document.querySelector('section table td:nth-child(1) input').click()
        }
        return true
      }
      return false
    })

    await page.evaluate(() => {
      document.querySelector('div.vds-text-input input').value = ''
    })
    await page.waitForTimeout(30)
  }
}

async function loginIntoUdacity (page, config) {
  try {
    await page.goto(config.GetUdacityLoginURL())
    await page.waitForTimeout(3000)
    const isAlreadyLoggedIn = await page.evaluate(() => {
      return document.querySelector('div[data-testid=\'signin-form\'] button') == null
    })
    if (!isAlreadyLoggedIn){
      await page.type('#email', config.GetUdacityEmail())
      await page.type('#revealable-password', config.GetUdacityPassword())
      await page.click('div[data-testid] button')

      await page.waitForTimeout(3000)

      await page.waitForSelector('[class^=session-info-header_info]')
      await page.waitForSelector('div.vds-text-input input')
    }
  }catch (e){
    console.log(e)
    throw new Error("Failed to login to udacity, make sure that you entered valid credentials")
  }
}

async function fillAttendance (page, config, participants) {
  try {
    console.log(config.GetAttendanceDay())
    await page.click('div.Select-control')
    await page.click(`.Select-menu-outer div[aria-label='${getAttendanceWeekValue(
      config.GetAttendanceDay())}']`)

    await page.evaluate(() => {
      document.querySelector('div.vds-text-input input').
        scrollIntoView({ block: 'end' })
    })

    let notFoundPart = await bulkParticipantsSelection(page, participants)
    await bulkSelectUsingSearch(page,notFoundPart)

    await markStudentsAsPersent(page)
    return notFoundPart
  }catch (e) {
    console.log(e)
    throw new Error("Failed to fill the attendance")
  }

}

async function pageSetup (page) {
  await page.setViewport({ width: 1366, height: 768 })
  await page.setUserAgent(
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4691.0 Safari/537.36')
}

async function markStudentsAsPersent (page) {
  await page.click('[class="Select-placeholder"]')
  let passedOptionId = await page.evaluate(() => {
    document.querySelector('div.vds-text-input input').value = ''
    let options = document.querySelectorAll(
      'div.Select-menu-outer div.Select-option')
    let passedOption = null
    for (const option of options) {
      if (option.innerText === 'Present') {
        console.log(option)
        passedOption = option
      }
    }
    return passedOption.id
  })
  await page.click('#' + passedOptionId)

}

function getAttendanceWeekValue (date) {
  date = new Date(date)
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December']

  return `${monthNames[date.getMonth()]} ${date.getDate() +
  nth(date.getDate())}`
}

function getReportsParamsArgs (date) {
  return `?from=${date}&to=${date}`
}

const nth = function (d) {
  if (d > 3 && d < 21) return 'th'
  switch (d % 10) {
    case 1:
      return 'st'
    case 2:
      return 'nd'
    case 3:
      return 'rd'
    default:
      return 'th'
  }
}

module.exports = {
  pageSetup,
  loginIntoZoom,
  getParticipantsFromZoom,
  loginIntoUdacity,
  fillAttendance,
}
