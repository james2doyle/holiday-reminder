import moment from 'moment';

// start 1 week from now
const startWeek = 7;
const endWeek = 13;
const start = moment().day(startWeek);
const startFormatted = start.format('dddd, MMMM Do YYYY');
const end = moment().day(endWeek);
const endFormatted = end.format('dddd, MMMM Do YYYY');

export default {
  startWeek,
  endWeek,
  start,
  startFormatted,
  end,
  endFormatted,
  botName: "Holiday Reminder",
  slackEmoji: ":calendar:",
  slackUrl: "",
  holidayUrl: "",
  JSONheaders: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
}