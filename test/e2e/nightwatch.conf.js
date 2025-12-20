require('babel-register')
var config = require('../../config')
var puppeteer = require('puppeteer')

// http://nightwatchjs.org/gettingstarted#settings-file
module.exports = {
  src_folders: ['test/e2e/specs'],
  output_folder: 'test/e2e/reports',
  custom_assertions_path: ['test/e2e/custom-assertions'],

  webdriver: {
    start_process: true,
    server_path: require('chromedriver').path,
    port: 9515
  },

  test_settings: {
    default: {
      silent: true,
      globals: {
        devServerURL: 'http://localhost:' + (process.env.PORT || config.dev.port)
      },
      desiredCapabilities: {
        browserName: 'chrome',
        chromeOptions: {
          binary: puppeteer.executablePath(),
          args: ['--headless', '--no-sandbox', '--disable-dev-shm-usage']
        }
      }
    },

    chrome: {
      desiredCapabilities: {
        browserName: 'chrome',
        javascriptEnabled: true,
        acceptSslCerts: true,
        chromeOptions: {
          binary: puppeteer.executablePath(),
          args: ['--headless', '--no-sandbox', '--disable-dev-shm-usage']
        }
      }
    },

    firefox: {
      desiredCapabilities: {
        browserName: 'firefox',
        javascriptEnabled: true,
        acceptSslCerts: true
      }
    }
  }
}
