import moment from 'moment';
import request from 'node-fetch';

// load up the config for the app
import config from '../config';

export default function () {
  if (!config.holidayUrl || config.holidayUrl.trim() === '') {
    console.error('There was no holidayUrl set in the config. Exiting.');
    process.exit(0);
  }

  console.log(`checking for holidays between ${config.startFormatted} and ${config.endFormatted}`);

  return new Promise((resolve, reject) => {
    request(config.holidayUrl, {
      method: 'get',
      headers: config.JSONheaders,
    })
    .then(res => res.json())
    .then((res) => {
      const yearHolidays = res[moment().year()];
      if (typeof (yearHolidays) === 'undefined') {
        resolve();
      }

      const checkStart = config.start.subtract(1, 'days').format('YYYY-MM-DD');
      const checkEnd = config.end.add(1, 'days').format('YYYY-MM-DD');

      const validHolidays = yearHolidays.filter(day => {
        // does the day fit inside the days for the next week?
        moment(day).isBetween(checkStart, checkEnd);
      });

      const attachments = validHolidays.map((day) => {
        const dayFormatted = moment(day).format('dddd, MMMM Do YYYY');

        return {
          fallback: `${dayFormatted} is a holiday next week.`,
          color: '#acc23a',
          title: `${dayFormatted} is a holiday next week.`,
        };
      });

      resolve(attachments);
    });
  });
}
