# Udacity Attandance auto filler

A script built on top of puppeteer to automate recording the students attendance for a specific group.


## Installation

Make sure that all of your accounts uses basic auth.
### Dependencies
* [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)


## Up & Running
### Locally
Make sure to pass the below env variables
```
ZOOM_EMAIL
ZOOM_PASSWORD
UDACITY_EMAIL 
UDACITY_PASSWORD
DASHBOARD_URL #The url you use to access your dashboard
```
Like below
```
export ZOOM_EMAIL=hamda@gmail.com ZOOM_PASSWORD="hamda" UDACITY_EMAIL=hamda UDACITY_PASSWORD='hamda' DASHBOARD_URL='https://connect-dashboard.udacity.com/connect/1234'
```

In case that you want to run the application on specifc day & not use the default value, you can pass the below arg.
```
node index.js --attendance-day=12/21/2021
```


#### Steps
1. ```shell
   npm i
   ```
1. ```shell
   node index.js
   ```

### Future plans
- [ ] Add github actions/circleci to run a weekly job that exec the script after the session day by 1 hour.