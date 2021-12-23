const args = require('minimist')(process.argv.slice(2))
let config = {
    zoom:{loginURL:"https://zoom.us/signin",reportsURL:"https://zoom.us/account/my/report"},
    udacity:{loginURL:""},
    attendanceDate :args['attendance-day'] ,
    CheckRequiredFields (){
        const requiredKeys = ["zoom","udacity"]
        for (const key of requiredKeys) {
            if (typeof this[key].EMAIL == "undefined") {
                
                throw `${key.toUpperCase()}_EMAIL is required as env variable`
            }
            if (typeof this[key].PASSWORD == "undefined") {
                throw `${key.toUpperCase()}_PASSWORD is required as env variable`
            }
        }

    }
}
if(typeof config.attendanceDate == "undefined"){
    let d = new Date()
    config.attendanceDate = `${d.getMonth()+1}/${d.getDate()}/${d.getFullYear()}`
}


config.zoom.EMAIL = process.env.ZOOM_EMAIL;
config.zoom.PASSWORD = process.env.ZOOM_PASSWORD;

config.udacity.EMAIL = process.env.UDACITY_EMAIL;
config.udacity.PASSWORD = process.env.UDACITY_PASSWORD;

config.udacity.loginURL = process.env.DASHBOARD_URL

module.exports = config