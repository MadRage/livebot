const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { create, load, fetch, remove } = require("discord-backup");

module.exports = {

    data: new SlashCommandBuilder()
    .setName("backup")
    .setDescription("Gère les backups")
    .setDMPermission(true)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(command => command.setName("create").setDescription("Crée une backup"))
    .addSubcommand(command => command.setName("load").setDescription("Charge une backup").addStringOption(option => option.setName("id").setDescription("ID de la backup").setRequired(true)))
    .addSubcommand(command => command.setName("list").setDescription("Liste les backups"))
    .addSubcommand(command => command.setName("delete").setDescription("Supprime une backup").addStringOption(option => option.setName("id").setDescription("ID de la backup").setRequired(true))),
    permissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.UseExternalEmojis, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.ViewChannel, PermissionFlagsBits.EmbedLinks],

    async run(interaction) {

        switch(interaction.options.getSubcommand()) {

            case "create": {

                await interaction.deferReply();

                const backup = await create(interaction.guild, {
                    maxMessagesPerChannel: 0,
                    jsonSave: true,
                    jsonBeautify: true,
                    saveImages: "base64"
                });

                interaction.client.db.insert("backups", ["guildID", "backupID", "date"], [interaction.guild.id, backup.id, Date.now()]);

                await interaction.followUp(`La backup \`${backup.id}\` a bien été enregistrée à cette date.`)

                break;
            };

            case "load": {

                const id = interaction.options.getString("id");
                const backup = await interaction.client.db.select("backups", ["backupID"], [id]);
                if(backup.length < 1) return await interaction.reply({content: `La backup n'existe pas.`, ephemeral: true});
                if(backup[0].guildID !== interaction.guildId) return await interaction.reply({content: `La backup n'existe pas.`, ephemeral: true});

                await interaction.deferReply();

                await load(backup[0].backupID, interaction.guild, {
                    clearGuildBeforeRestore: true
                });

                interaction.client.db.delete("backups", ["backupID"], [backup[0].backupID]);
                await interaction.followUp(`La backup \`${backup.id}\` a bien été chargée sur le serveur.`)

                break;
            };

            case "list": {

                const backups = (await interaction.client.db.select("backups", ["guildID"], [interaction.guildId])).sort((a, b) => parseInt(b.date) - parseInt(a.date));
                if(backups.length < 1) return await interaction.reply({content: `Aucune backup.`, ephemeral: true});

                await interaction.deferReply();

                const embed = new EmbedBuilder()
                .setColor(interaction.client.color)
                .setTitle(`Backups du serveur ${interaction.guild.name}`)
                .setThumbnail(interaction.guild.iconURL())
                .setTimestamp()
                .setFooter({text: interaction.user.globalName, iconURL: interaction.user.displayAvatarURL()});

                for(let i = 0; i < backups.length; i++) {
                    const data = await fetch(backups[i].backupID);
                    embed.addFields({name: `Backup \`${i+1}\``, value: `ID: \`${data.id}\`\nPoids : \`${data.size}\`\nDate: <t:${Math.floor(parseInt(backups[i].date) / 1000)}:F>`});
                };

                await interaction.followUp({embeds: [embed]})

                break;
            };

            case "delete": {

                const id = interaction.options.getString("id");
                const backup = await interaction.client.db.select("backups", ["backupID"], [id]);
                if(backup.length < 1) return await interaction.reply({content: `La backup n'existe pas.`, ephemeral: true});
                if(backup[0].guildID !== interaction.guildId) return await interaction.reply({content: `La backup n'existe pas.`, ephemeral: true});

                await interaction.deferReply();

                await remove(backup[0].backupID, interaction.guild);

                interaction.client.db.delete("backups", ["backupID"], [backup[0].backupID]);
                await interaction.followUp(`La backup \`${backup.backupID}\` a bien été supprimée.`)

                break;
            };
        };
    }
};