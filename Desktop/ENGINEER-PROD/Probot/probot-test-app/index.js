/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */
module.exports = (app) => {
  app.log.info('App is trigger by a issues then send a pull request');

  app.on('issues.opened', async (context) => {
    // add the repo in Array then create an issue
    const repository = ['probot-test-repo-alpha', 'probot-test-repo-beta'];
    for (const i of repository) {
      await context.octokit.rest.pulls.create({
        owner: 'lendly-telus-com',
        repo: i,
        title: 'for dummy pr',
        head: 'test-pull-request',
        base: 'main',
      });
    }
  });
};
