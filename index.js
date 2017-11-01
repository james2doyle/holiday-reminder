const request = require('node-fetch');
const moment = require('moment');

// load up the config for the app
const config = require('./config.json');

class App {
  constructor(conf) {
    this.config = conf;
  }
  setupDates() {
    this.start = moment().day(this.config.startWeek);
    this.startFormatted = this.start.format('dddd, MMMM Do YYYY');

    this.end = moment().day(this.config.endWeek);
    this.endFormatted = this.end.format('dddd, MMMM Do YYYY');
    return this;
  }
  makeHolidayRequest() {
    if (!this.config.holidayUrl || this.config.holidayUrl.trim() === "") {
      console.error('There was no holidayUrl set in the config. Exiting.');
      process.exit(0);
    }

    console.log(`checking for holidays between ${this.startFormatted} and ${this.endFormatted}`);

    return new Promise((resolve, reject) => {
      request(this.config.holidayUrl, {
          method: 'get',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          const yearHolidays = res[moment().year()];
          if (typeof(yearHolidays) === 'undefined') {
            resolve([]);
          }

          const validHolidays = yearHolidays.filter((day) => {
            // does the day belong in the nexy week?
            return moment(day).isBetween(this.start, this.end);
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
  postToSlack(attachments) {
    if (attachments.length < 1) {
      console.log('There were no holidays found for the upcoming week.');
      return;
    }

    const prefix = (process.env.NODE_ENV != 'production') ? "======TESTING======\n" : '<!channel> ';

    const message = {
      username: this.config.botName,
      icon_emoji: this.config.slackEmoji,
      text: `${prefix}Here are your holiday reminders for the upcoming week! :tada:`,
      attachments
    };

    if (process.env.NODE_ENV != 'production') {
      console.log(message);
      return;
    }

    return request(this.config.slackUrl, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(message)
    });
  }
}

const app = new App(config);

app
  .setupDates()
  .makeHolidayRequest()
  .then(app.postToSlack)
  .catch((err) => {
    console.error(err);
    process.exit(0);
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