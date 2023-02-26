const core = require('@actions/core');
const github = require('@actions/github');
const fetch = require('node-fetch-commonjs');
const script = require('./script');

(async () => {
  const questionIds = core.getInput('question_ids').trim().split(',');
  const standupId = core.getInput('standup_id');
  const members = core.getInput('members').trim().split(',');
  const geekbotApiKey = core.getInput('geekbot_api_key');
  const slackBotToken = core.getInput('slack_bot_token');
  const slackChannelName = core.getInput('slack_channel_name');

  try {
    const result = await script({ geekbotApiKey, slackBotToken, slackChannelName, fetch, core, questionIds, standupId, members });
  } catch (error) {
    core.setFailed(error.message);
  }
})();

