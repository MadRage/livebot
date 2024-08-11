const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {

    data: new SlashCommandBuilder()
    .setName("clear-all")
    .setDescription("Supprime les tous les messages du serveur d'un utilisateur")
    .setDMPermission(true)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addUserOption(option => option.setName("utilisateur").setDescription("L'utilisateur à qui supprimer les messages").setRequired(true)),
    permissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.UseExternalEmojis, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.ViewChannel, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.ManageMessages],

    async run(interaction) {

        const user = interaction.options.getUser("utilisateur");
        const me = await interaction.guild.members.fetchMe();

        let count = 0;

        await interaction.deferReply();

        for(const channel of [...(await interaction.guild.channels.fetch()).filter(c => c.isTextBased() && c.permissionsFor(me).has([PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ReadMessageHistory])).values()]) {
            const messages = (await channel.messages?.fetch()).filter(m => m.author.id === user.id);
            if(messages.size > 0) {
                const deleted = await channel.bulkDelete(messages, true);
                count += deleted.size;
            };
        };

        await interaction.followUp(`J'ai supprimé un total de \`${count}\` message${count > 1 ? "s" : ""} de \`${user.username}\`.`);
    }
};