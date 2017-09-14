'use strict';

import * as vandium from 'vandium';
import * as Slack from 'slack-node';

const SLACK_WEBHOOK = process.env.SLACK_WEBHOOK;
const FB_ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN;
const SLACK_CHANNEL = process.env.SLACK_CHANNEL;
const ICONS = [':hamburger:', ':hotdog:', ':pizza:', ':taco:', ':burrito:', ':ramen:', ':stew:', ':curry:'];

if (!SLACK_WEBHOOK || !SLACK_CHANNEL || !FB_ACCESS_TOKEN) {
  console.error('missing env variables');
  throw new Error('missing env variables');
}

import { getKamra } from './restaurants/kamra';
import { getFrukkola } from './restaurants/frukkola';

const slack = new Slack();

slack.setWebhook(SLACK_WEBHOOK);

function slackWebhook(options: Slack.WebhookOptions) {
  return new Promise((resolve, reject) => {
    slack.webhook(options, (err, result: Slack.WebhookResponse) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
}

export const food = vandium(async function food(): Promise<any> {
  const attachments = await Promise.all([
    getKamra(),
    getFrukkola(),
  ]);

  await slackWebhook({
    username: 'fooding-sans-bot',
    icon_emoji: ICONS[Math.trunc(Math.random() * ICONS.length)],
    channel: SLACK_CHANNEL,
    attachments,
  });

  return {
    statusCode: 200,
  };
});
