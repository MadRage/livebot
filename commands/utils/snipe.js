const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {

    data: new SlashCommandBuilder()
    .setName("snipe")
    .setDescription("Renvoie le dernier message supprimé d'un salon")
    .setDMPermission(false)
    .setDefaultMemberPermissions(null)
    .addChannelOption(option => option.setName("salon").setDescription("Le salon à checker").setRequired(false)),
    permissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.UseExternalEmojis, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.ViewChannel, PermissionFlagsBits.EmbedLinks],

    async run(interaction) {

        const channel = interaction.options.getChannel("salon") || interaction.channel;
        const message = interaction.client.snipe.get(channel.id);
        if(!message) return await interaction.reply({content: `Aucun message n'a été supprimé dans ${channel}.`, ephemeral: true});

        const embed = new EmbedBuilder()
        .setColor(interaction.client.color)
        .setAuthor({name: message.author.globalName, iconURL: message.author.displayAvatarURL()})
        .setDescription(`\`${message.content}\``)
        .setTimestamp(message.deletedTimestamp);

        await interaction.reply({embeds: [embed]});
    }
}