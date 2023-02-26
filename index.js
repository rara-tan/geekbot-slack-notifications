const core = require('@actions/core');
const github = require('@actions/github');
const script = require('./script');

try {
  const questionIds = process.env.question_ids.split(',').trim();
  const standupId = process.env.standup_id;
  const members = process.env.members.split(',').trim();
  const result = await script({
    geekbotApiKey: process.env.geekbot_api_key,
    fetch,
    core,
    questionIds,
    standupId,
    members
  });
  core.setOutput(result);
} catch (error) {
  core.setFailed(error.message);
}
