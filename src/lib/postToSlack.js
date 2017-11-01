import request from 'node-fetch';

// load up the config for the app
import config from '../config';

export default function(attachments) {
  if (attachments.length < 1) {
    console.log('There were no holidays found for the upcoming week.');
    return;
  }

  if (!config.slackUrl || config.slackUrl.trim().length === 0) {
    console.error('There was no slackUrl set in the config. Exiting.');
    return;
  }

  const prefix = (process.env.NODE_ENV !== 'production') ? `======TESTING======\n` : '<!channel> ';

  const message = {
    username: config.botName,
    icon_emoji: config.slackEmoji,
    text: `${prefix}Here are your holiday reminders for the upcoming week! :tada:`,
    attachments
  };

  if (process.env.NODE_ENV !== 'production') {
    console.log(message);
    return;
  }

  return request(config.slackUrl, {
    method: 'post',
    headers: config.JSONheaders,
    body: JSON.stringify(message)
  });
}