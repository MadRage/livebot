const { Events, ChannelType, Webhook, WebhookClient } = require("discord.js");

module.exports = {

    name: Events.MessageCreate,
    once: false,

    async run(client, message) {

        if(message.author.bot) return;

        if(message.channel.type === ChannelType.DM) {

            const data = await client.db.select("modmail", ["userID"], [message.author.id]);

            if(data.length > 0) {

                const webhook = new WebhookClient({url: data[0].webhookURL});
                await webhook.send(message.content);

            } else {

                const guild = client.guilds.cache.get("875659838842085376");
                const channel = await guild.channels.create({name: `ticket-${message.author.username}`, type: ChannelType.GuildText});

                await channel.permissionOverwrites.create(guild.roles.everyone, {
                    SendMessages: false,
                    ViewChannel: false,
                    ReadMessageHistory: false
                });
                await channel.permissionOverwrites.create(message.author, {
                    SendMessages: true,
                    ViewChannel: true,
                    ReadMessageHistory: true,
                    EmbedLinks: true,
                    AttachFiles: true
                });

                const webhook = await channel.createWebhook({
                    name: message.author.globalName,
                    avatar: message.author.displayAvatarURL()
                });

                client.db.insert("modmail", ["userID", "channelID", "webhookURL"], [message.author.id, channel.id, webhook.url]);

                await webhook.send(message.content);
                await message.reply("Votre demande a bien été soumise !");
            };
        };

        const data = await client.db.select("modmail", ["channelID"], [message.channel.id]);

        if(data.length > 0) {

            const user = await client.users.fetch(data[0].userID);

            if(message.content.startsWith(".finish")) {
                await user.send(`Votre demande a été fermée.`);
                await message.channel.delete();
                client.db.delete("modmail", ["userID"], [user.id]);
            } else await user.send(`**${message.author.globalName}** : ${message.content}`);
        }
    }
}