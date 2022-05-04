const args = require('minimist')(process.argv.slice(2))
let config = {
    zoom:{loginURL:"https://zoom.us/signin",reportsURL:"https://zoom.us/account/my/report"},
    udacity:{loginURL:""},
    attendanceDate :args['attendance-day'] ,
    retryAttendanceConfirmationTimes: 3,
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

    },
    GetZoomLoginURL() {
       return this.zoom.loginURL
    },
    GetZoomReportsURL() {
        return this.zoom.reportsURL
    },
    GetZoomEmail(){
        return this.zoom.EMAIL
    },
    GetZoomPassword() {
        return this.zoom.PASSWORD
    },
    GetUdacityLoginURL(){
        return this.udacity.loginURL
    },
    GetUdacityEmail(){
        return this.udacity.EMAIL
    },
    GetUdacityPassword(){
       return this.udacity.PASSWORD
    },
    GetAttendanceDay(){
        return this.attendanceDate
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
