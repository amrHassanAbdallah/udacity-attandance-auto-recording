const config = require('./config');
const puppeteer = require('puppeteer');

async function getParticipantsFromZoom(page) {
    await page.goto(config.zoom.loginURL, {waitUntil: 'networkidle0', timeout: 60000})
    await page.type('#email', config.zoom.EMAIL)
    await page.type('#password', config.zoom.PASSWORD)
    await page.click('div.signin button')
    await page.waitForSelector("#app")
    //console.log(await page.evaluate(() => navigator.userAgent));
    //get the report data
    await page.goto(config.zoom.reportsURL + getReportsParamsArgs(config.attendanceDate), {waitUntil: 'networkidle0'})
    try {
        await page.waitForSelector('a[data-attendees]');
    } catch (error) {
        console.log("No records found in this '" + config.attendanceDate + "' date, or the page took too long to load.")
        process.exit(1)
    }
    await page.click(`a[data-attendees]`);
    await page.waitForSelector('div.modal-body table tr:nth-child(2)');

    await page.evaluate(() => {
        document.querySelector("#selectUnique").click();
    });

    await page.waitForSelector('div.modal-body table tr:nth-child(2)');


    return page.evaluate(() => {
        let participants = []
        let rows = document.querySelectorAll("div.modal-body table tr")
        for (let i = 1; i < rows.length; i++) {
            let cells = rows[i].cells
            let participant = {
                name: cells[0].innerText.toLowerCase().replace(/[^a-zA-Z0-9]/g, ' '),
                email: cells[1].innerText,
                duration: cells[2].innerText,
            }
            participants.push(participant)
        }
        return participants

    })
}

(async () => {
    config.CheckRequiredFields()
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.setViewport({width: 1366, height: 768});
    await page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4691.0 Safari/537.36")
    let participants = await getParticipantsFromZoom(page);
    // console.log(participants)
    //let participants = [{name: "kareem mohamed"}, {name: "Belal Ibrahim"}, {name: "hamda"}]
    //console.log(participants)
    //go to udacity
    //fill the attendance
    await page.goto(config.udacity.loginURL, {waitUntil: 'networkidle0', timeout: 60000})
    await page.type('#email', config.udacity.EMAIL)
    await page.type('#revealable-password', config.udacity.PASSWORD)
    await page.click('div[data-testid] button')

    await page.waitForTimeout(3000);


    await page.waitForSelector("[class^=session-info-header_info]")
    await page.waitForSelector("div.vds-text-input input")

    //document.querySelector(".Select-menu-outer div[aria-label='December 14th']")
    console.log(config.attendanceDate)
    await page.click('div.Select-control')
    await page.click(`.Select-menu-outer div[aria-label='${getAttendanceWeekValue(config.attendanceDate)}']`)


    await page.evaluate(() => {
        document.querySelector("div.vds-text-input input").scrollIntoView({block: "end"})
    })

    await page.waitForSelector("div.vds-text-input input")
    await page.waitForSelector("section table tr:nth-child(1)")
    let notFoundPart = []
    for (const participant of participants) {
        await page.evaluate(() => {
            document.querySelector("div.vds-text-input input").value = ""
        });
        await page.type("div.vds-text-input input", participant.name);
        let isFound = await page.evaluate(() => {
            if (document.querySelector("section table td:nth-child(1) input")) {
                document.querySelector("section table td:nth-child(1) input").click();
                return true
            }
            return false
        });
        if (!isFound) {
            notFoundPart.push(participant)
        }


        await page.waitForTimeout(30)


    }

    for (let i = 0; i < config.retryAttendanceConfirmationTimes; i++) {
        await markStudentsAsPersent(page);
        await sleep((Math.floor(Math.random() * 11) + 1) * 100);
    }
    if (notFoundPart.length > 0) {
        console.log(`there are ${notFoundPart.length} out of ${participants.length} participants that didn't match over udacity `, notFoundPart)
    }


    await browser.close();

})();

async function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

async function markStudentsAsPersent(page) {
    await page.click('[class="Select-placeholder"]')
    let passedOptionId = await page.evaluate(() => {
        document.querySelector("div.vds-text-input input").value = ""
        let options = document.querySelectorAll('div.Select-menu-outer div.Select-option');
        let passedOption = null
        for (const option of options) {
            if (option.innerText === "Present") {
                console.log(option)
                passedOption = option
            }
        }
        return passedOption.id;
    });
    await page.click("#" + passedOptionId)

}

function getAttendanceWeekValue(date) {
    date = new Date(date)
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


    return `${monthNames[date.getMonth()]} ${date.getDate() + nth(date.getDate())}`
}

function getReportsParamsArgs(date) {
    return `?from=${date}&to=${date}`
}

const nth = function (d) {
    if (d > 3 && d < 21) return 'th';
    switch (d % 10) {
        case 1:
            return "st";
        case 2:
            return "nd";
        case 3:
            return "rd";
        default:
            return "th";
    }
}