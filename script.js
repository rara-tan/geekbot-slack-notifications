module.exports = async ({ geekbotApiKey, fetch, core, questionIds, standupId, members }) => {
  const d = new Date()
  const dateAfter = parseInt(d.setDate(d.getDate() - 7) / 1000)

  const reportResults = await Promise.all(
    members.map(async (member) => {
      const userId = member
      const query = new URLSearchParams({
        question_ids: questionIds,
        standup_id: standupId,
        user_id: userId,
        after: dateAfter,
      }).toString()
      try {
        console.log(query);
        const res = await fetch(`https://api.geekbot.com/v1/reports?${query}`, {
          headers: { Authorization: geekbotApiKey },
        })
        console.log(res);
        if (!res.ok) {
          return {
            isSuccess: false,
            userId,
            message: 'server error',
          }
        }
        console.log(res.ok);
        let contents
        try {
          contents = await res.json()
        } catch (err) {
          return {
            isSuccess: false,
            userId,
            message: 'json error',
          }
        }
        console.log(contents);
        return {
          isSuccess: true,
          userId,
          message: 'Succeeded',
          contents,
        }
      } catch (err) {
        core.error(err)
        return {
          isSuccess: false,
          userId,
          message: 'network error',
        }
      }
    }),
  )

  console.log(reportResults);
  const slackMessages = reportResults.map((report) => {
    const slackMessage = {
      mrkdwn_in: ['text'],
      color: Math.floor(Math.random() * 16777215).toString(16), // random color
      author_name: "test"
    }

    // Fetch Error
    if (!report.isSuccess) {
      slackMessage.text = `Failed to get Contents. Due to ${report.message}`
      return slackMessage
    }

    // No Contents
    if (report.contents.length === 0) {
      slackMessage.text = `No Contents`
      return slackMessage
    }

    // No Questions
    const answeredReports = report.contents.filter(
      (content) => content.questions.length > 0,
    )
    console.log(answeredReports);
    if (answeredReports.length === 0) {
      slackMessage.text = `No Questions`
      return slackMessage
    }

    console.log("aa");
    slackMessage.fields = answeredReports.map((report) => {
      const d = new Date(report.timestamp * 1000)
      return {
        title: `【${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}】`,
        value: `${report.questions[0].answer}`,
        short: false,
      }
    })
    console.log(slackMessage);
    return slackMessage
  })
  console.log(slackMessages);

  return {
    attachments: [
      {
        mrkdwn_in: ['text'],
        text: ':robot_face: Hello! The completed tasks of the team members over the past 1 week are as follows',
      },
      ...slackMessages,
    ],
  }
}
