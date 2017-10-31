Holiday Reminder
================

> Sends reminders to Slack that you have upcoming holidays next week

### Setup

* clone this repo
* `npm install`
* `cp config-example.json config.json`
* Fill in the values in the `config.json` file.
* `npm run test`

You will need to also [setup a Slack Webhook](https://api.slack.com/custom-integrations/incoming-webhooks) for the results to be sent to.

### Config

```
{
  "startWeek": 7, // the day of the week to start on. 0 is sunday
  "endWeek": 13,
  "botName": "Holiday Reminder",
  "slackEmoji": ":calendar:",
  "slackUrl": "", // slack webhook to post to
  "holidayUrl": "" // the json file where the holidays live
}
```

#### Holiday JSON File

Example of the expected JSON file:

```
{
  "2017": [
    "2017-01-02",
    "2017-02-13",
    "2017-04-14",
    "2017-05-22",
    "2017-07-03",
    "2017-08-07",
    "2017-09-04",
    "2017-10-09",
    "2017-11-13",
    "2017-12-25",
    "2017-12-26",
    "2017-12-27",
    "2017-12-28",
    "2017-12-29"
  ]
}
```

It expects an object keyed by the current year, and then an array of dates in `YYYY-MM-DD` format inside of that.

If the `holidayUrl` field is empty or undefined, holidays will not be accounted for.

### Testing

Run `npm run test` to print the ending Slack call to the console.

### Production

Run `npm start` to execute the program in production mode. This will actually ping Slack with an `@channel` mention.
