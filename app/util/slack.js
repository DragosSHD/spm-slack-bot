const { App } = require("@slack/bolt");
require("dotenv").config();

const app = new App({
    token: process.env.SLACK_APP_BOT_TOKEN,
    appToken: process.env.SLACK_APP_TOKEN,
    socketMode: true,
    signingSecret: process.env.SLACK_APP_SIGNING_TOKEN,
});


app.event('member_joined_channel', async ({ event }) => {
    try {
        console.log(`User ${event.user} joined the channel ${event.channel}`);
    } catch (error) {
        console.error(error);
    }
});

(async () => {
    // Start your app
    const boltPORT = 5000;
    await app.start(boltPORT);
    console.log(`⚡️ Bolt app is running on port ${boltPORT}!`);
})();

exports.publishMessage = async (id, text) => {
    try {
        // Call the chat.postMessage method using the built-in WebClient
        const result = await app.client.chat.postMessage({
            // The token you used to initialize your app
            token: process.env.SLACK_APP_BOT_TOKEN,
            channel: id,
            text: text
            // You could also use a blocks[] array to send richer content
        });

        // Print result, which includes information about the message (like TS)
        console.log(result);
    }
    catch (error) {
        console.error(error);
    }
};

exports.createChannel = async (name) => {
    try {
        return await app.client.conversations.create({ name });
    }
    catch (error) {
        console.error(error);
        return error.data;
    }
};