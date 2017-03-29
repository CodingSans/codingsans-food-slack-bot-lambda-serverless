const moment = require('moment');
const momentTz = require('moment-timezone');

module.exports.schedule = () => {
  const hour = moment().isDST() ? 12 : 11;
  const elevenInCet = momentTz.tz('CET').set('hour', hour).utc().get('hours');
  return {
    CET11: `cron(0 ${ elevenInCet } ? * MON-FRI *)`,
  };
}
