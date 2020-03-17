const SlackClient = require('@slack/client');

const token = process.env.SLACK_TOKEN;

function createSlackClientWrapper() {
    const client = new SlackClient.WebClient(token);

    async function focusStart() {
        await client.dnd.setSnooze({ num_minutes: 25 });
        await client.users.profile.set({ profile: { status_text: 'FOCUS TIME. Will be back in 25 minutes' } });
    }

    async function focusEnd() {
        await client.dnd.endSnooze();
        await client.users.profile.set({ profile: { status_text: 'I am back. Focus time finished.' } });
    }

    return { focusStart, focusEnd };
}

module.exports = createSlackClientWrapper;
