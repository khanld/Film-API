const CronJob = require('cron').CronJob
const filmContentCrawler = require('../crawler/crawler')

const cron = new CronJob('0 */5 * * * *', filmContentCrawler)

module.exports = cron