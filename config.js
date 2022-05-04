let config = {
    zoom:{loginURL:"https://zoom.us/signin",reportsURL:"https://zoom.us/account/my/report",EMAIL:"",PASSWORD:""},
    udacity:{loginURL:"",EMAIL:"",PASSWORD:""},
    attendanceDate :"" ,
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


module.exports = config
