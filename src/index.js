import fetchHoliday from './lib/fetchHolidays';
import postToSlack from './lib/postToSlack';

export default function run() {
  return fetchHoliday()
    .then(postToSlack)
    .catch((err) => {
      console.log(err);
    });
}

process.on('uncaughtException', (err) => {
  console.log('uncaughtException', err.stack);
});

process.on('unhandledRejection', (reason, p) => {
  console.log('unhandledRejection', {
    p,
    reason
  });
});

if (require.main === module) {
  run();
}