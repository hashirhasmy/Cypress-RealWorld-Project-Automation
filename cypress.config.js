const { defineConfig } = require("cypress")
const dotenv = require("dotenv");
dotenv.config({ path: ".env.cypress" });
dotenv.config();

module.exports = defineConfig({
  video: false,
  screenshotOnRunFailure : false,
  defaultCommandTimeout: 10000,  //cypress default untill element apear tomout is 4 second here i change it to 10 second
  nodeVersion: "system",
  env: {
    BASE_URL: process.env.BASE_URL,
    BACKEND_URL: process.env.BACKEND_URL,
    RT: process.env.RT,
    NORMAL_AGENT_RT: process.env.NORMAL_AGENT_RT
  },
  e2e: {
    browser: "chrome",
    baseUrl: process.env.BASE_URL,
  },
});
