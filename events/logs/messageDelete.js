const { Events } = require("discord.js");

module.exports = {

    name: Events.MessageDelete,
    once: false,

    async run(client, message) {

        message.deletedTimestamp = Date.now();
        client.snipe.set(message.channel.id, message);
    }
};