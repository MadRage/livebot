const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {

    data: new SlashCommandBuilder()
    .setName("poll")
    .setDescription("Crée un sondage")
    .setDMPermission(true)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(option => option.setName("question").setDescription("La question de votre sondage").setRequired(true))
    .addNumberOption(option => option.setName("duree").setDescription("La durée du sondage (en heures)").setMinValue(0).setRequired(true))
    .addStringOption(option => option.setName("options").setDescription("Les options de votre sondage (séparées d'une virgule)").setRequired(true)),
    permissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.UseExternalEmojis, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.ViewChannel, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.SendPolls],

    async run(interaction) {

        const question = interaction.options.getString("question");
        const duration = interaction.options.getNumber("duree");
        const options = interaction.options.getString("options").split(",");

        const poll = {
            question: {
                text: question
            },
            duration,
            allowMultiselect: true,
            answers: options.map(opt => ({text: opt}))
        };

        await interaction.reply({poll});
    }
};