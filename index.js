const core = require('@actions/core');
const github = require('@actions/github');
const script = require('./script');

try {
  script({
    geekbotApiKey: process.env.geekbot_api_key,
    fetch,
    core,
    questionIds: process.env.question_ids,
    standupId, process.env.standup_id,
    members, process.env.members
  });
} catch (error) {
  core.setFailed(error.message);
}
