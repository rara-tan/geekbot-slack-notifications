const core = require('@actions/core');
const github = require('@actions/github');
const script = require('./script');
const fetch = require('node-fetch-commonjs');

(async () => {
  const questionIds = core.getInput('question_ids').trim().split(',');
  const standupId = core.getInput('standup_id');
  const members = core.getInput('members').trim().split(',');
  try {
    const result = await script({
      geekbotApiKey: core.getInput('geekbot_api_key'),
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
  core.setOutput(standupId);
})();

