const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {

    data: new SlashCommandBuilder()
    .setName("slowmode")
    .setDescription("Active le mode lent sur un salon")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addNumberOption(option => option.setName("duree").setDescription("Duree du mode lent").setMinValue(0).setMaxValue(21600).setRequired(true))
    .addChannelOption(option => option.setName("salon").setDescription("Le salon à mettre en mode lent").setRequired(false)),
    permissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.UseExternalEmojis, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.ViewChannel, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.ManageChannels],

    async run(interaction) {

        const duration = interaction.options.getNumber("duree");
        const channel = interaction.options.getChannel("salon") || interaction.channel;

        if(!channel.isTextBased()) return await interaction.reply({content: `${channel} n'est pas un salon textuel.`, ephemeral: true});
        if(channel.rateLimitPerUser === duration) return await interaction.reply({content: `Le mode lent est déjà de \`${duration}\` secondes sur le salon ${channel}.`, ephemeral: true});
        
        await channel.setRateLimitPerUser(duration);
        await interaction.reply(`Le mode lent est de \`${duration}\` seconde${duration > 1 ? "s" : ""} sur le salon ${channel}.`);
    }
}