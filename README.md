Holiday Reminder
================

> Sends reminders to Slack that you have upcoming holidays next week

## Setup

* clone this repo
* `npm install`
* `cp src/config-example.js src/config.js`
* Fill in the values in the `src/config.js` file.
* `npm run dev`

You will need to also [setup a Slack Webhook](https://api.slack.com/custom-integrations/incoming-webhooks) for the results to be sent to.

### Holiday JSON File

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

## Production

Run `npm start` to execute the program in production mode. You will need to run `npm run build` first. This will actually ping Slack with an `@channel` mention.

## Commands

### Lint

```
npm run lint
```

### Build

```
npm run build
```

### Run

#### ES6 code via babel

```
npm run dev
```

#### ES5 code (Transpiled)

```
npm run build

node lib/
```

or

```
npm start
```

## Code Directories

* ./src - source code, stays in git repo.
* ./lib - transpiled ES5 code, not saved in git, gets published to npm.

## License

  [MIT](LICENSE)