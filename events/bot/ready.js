const { Events } = require("discord.js");

module.exports = {

    name: Events.ClientReady,
    once: true,

    async run(client) {

        console.log(`[Bot] => logged in as ${client.user.tag}`);
    }
};