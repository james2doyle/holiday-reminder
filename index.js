const request = require('node-fetch');
const moment = require('moment');

// load up the config for the app
const config = require('./config.json');

// get the times from the next week
const start = moment().day(config.startWeek);
const startFormatted = start.format('dddd, MMMM Do YYYY');

const end = moment().day(config.endWeek);
const endFormatted = end.format('dddd, MMMM Do YYYY');

const JSONheaders = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};

function holidays() {
  if (!config.holidayUrl || config.holidayUrl.trim() === "") {
    console.error('There was no holidayUrl set in the config. Exiting.');
    process.exit(0);
  }

  console.log(`checking for holidays between ${startFormatted} and ${endFormatted}`);

  return new Promise(function(resolve, reject) {
    request(config.holidayUrl, {
        method: 'get',
        headers: JSONheaders
      })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        const yearHolidays = res[moment().year()];
        if (typeof(yearHolidays) === 'undefined') {
          resolve();
        }

        const validHolidays = yearHolidays.filter((day) => {
          // does the day belong in the nexy week?
          return moment(day).isBetween(start, end);
        });

        const attachments = validHolidays.map((day) => {
          const dayFormatted = moment(day).format('dddd, MMMM Do YYYY');

          return {
            fallback: `${dayFormatted} is a holiday next week.`,
            color: "#c93742",
            title: `${dayFormatted} is a holiday next week.`
          };
        });

        resolve(attachments);
      });
  });
}

function postToSlack(attachments) {
  if (attachments.length < 1) {
    console.log('There were no holidays found for the upcoming week.');
    return;
  }

  const prefix = (process.env.NODE_ENV != 'production') ? "======TESTING======\n" : '<!channel> ';

  const message = {
    username: config.botName,
    icon_emoji: config.slackEmoji,
    text: `${prefix}Here are your holiday reminders for the upcoming week! :tada:`,
    attachments
  };

  if (process.env.NODE_ENV != 'production') {
    console.log(message);
    return;
  }

  return request(config.slackUrl, {
    method: 'post',
    headers: JSONheaders,
    body: JSON.stringify(message)
  });
}

holidays()
  .then(postToSlack)
  .catch((err) => {
    console.log(err);
  });

process.on('uncaughtException', (err) => {
  console.log('uncaughtException', err.stack);
});

process.on('unhandledRejection', (reason, p) => {
  console.log('unhandledRejection', {
    p,
    reason
  });
});