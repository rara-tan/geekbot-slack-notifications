const core = require('@actions/core');
const github = require('@actions/github');
const script = require('./script');

(async () => {
  const questionIds = core.getInput('question_ids').split(',').trim();
  const standupId = core.getInput('standup_id');
  const members = core.getInput('members').split(',').trim();
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
})();

