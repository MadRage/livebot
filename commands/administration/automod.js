const { SlashCommandBuilder, PermissionFlagsBits, AutoModerationActionType, AutoModerationRuleEventType, AutoModerationRuleTriggerType } = require("discord.js");

module.exports = {

    data: new SlashCommandBuilder()
    .setName("automod")
    .setDescription("Crée une règle d'automod")
    .setDMPermission(true)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption(option => option.setName("nom").setDescription("Le nom de la règle d'automod").setRequired(true))
    .addNumberOption(option => option.setName("duree").setDescription("La durée du timeout (en secondes)").setMinValue(0).setRequired(true))
    .addChannelOption(option => option.setName("salon").setDescription("Le salon où envoyer l'alerte").setRequired(true))
    .addStringOption(option => option.setName("type").setDescription("Le type de la règle").setRequired(true).addChoices({name: "message envoyé", value: "1"}, {name: "modification de profil", value: "2"})),
    permissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.UseExternalEmojis, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.ViewChannel, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.ManageGuild, PermissionFlagsBits.ModerateMembers],

    async run(interaction) {

        const name = interaction.options.getString("nom");
        const duration = interaction.options.getNumber("duree");
        const channel = interaction.options.getChannel("salon");
        const type = parseInt(interaction.options.getString("type"));

        if(!channel.isTextBased()) return await interaction.reply({content: `${channel} n'est pas un salon textuel.`, ephemeral: true});
        if(type !== 1 && type !== 2) return await interaction.reply({content: `Type invalide.`, ephemeral: true});

        const rule = await interaction.guild.autoModerationRules.create({
            name,
            enabled: true,
            actions: [
                {
                    type: AutoModerationActionType.BlockMessage
                }, {
                    type: AutoModerationActionType.SendAlertMessage,
                    metadata: {
                        channel
                    }
                }, {
                    type: AutoModerationActionType.Timeout,
                    metadata: {
                        durationSeconds: duration
                    }
                }
            ],
            eventType: type,
            triggerType: type === AutoModerationRuleEventType.MessageSend ? AutoModerationRuleTriggerType.Spam : 6
        });

        await interaction.reply(`La règle d'automod \`${rule.name}\` a bien été créée.`);
    }
};