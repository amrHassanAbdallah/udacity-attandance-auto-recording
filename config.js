let config = {
  zoom: {
    loginURL: 'https://zoom.us/signin',
    reportsURL: 'https://zoom.us/account/my/report',
    EMAIL: '',
    PASSWORD: '',
  },
  udacity: { loginURL: '', EMAIL: '', PASSWORD: '' },
  attendanceDate: '',
  Init (
    attendanceDate = undefined, zoomEmail = undefined, zoomPassword = undefined,
    udacityEmail = undefined, udacityPassword = undefined,
    udacityLoginURL = undefined) {
    this.attendanceDate = attendanceDate
    this.zoom.EMAIL = zoomEmail
    this.zoom.PASSWORD = zoomPassword
    this.udacity.email = udacityEmail
    this.udacity.password = udacityPassword
    this.udacity.loginURL = udacityLoginURL
  },
  GetZoomLoginURL () {
    return this.zoom.loginURL
  },
  GetZoomReportsURL () {
    return this.zoom.reportsURL
  },
  GetZoomEmail () {
    return this.zoom.EMAIL
  },
  GetZoomPassword () {
    return this.zoom.PASSWORD
  },
  GetUdacityLoginURL () {
    return this.udacity.loginURL
  },
  GetUdacityEmail () {
    return this.udacity.EMAIL
  },
  GetUdacityPassword () {
    return this.udacity.PASSWORD
  },
  GetAttendanceDay () {
    if (typeof config.attendanceDate == 'undefined') {
      let d = new Date()
      this.attendanceDate = `${d.getMonth() +
      1}/${d.getDate()}/${d.getFullYear()}`
    }
    return this.attendanceDate
  },
}

module.exports = config
