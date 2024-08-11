const { PermissionFlagsBits, ComponentType } = require("discord.js");

module.exports = {
    
    name: "ping",
    type: ComponentType.Button,
    botpermissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.UseExternalEmojis, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.ViewChannel, PermissionFlagsBits.EmbedLinks],

    async run(interaction) {
        
        await interaction.message.edit({content: `Mon ping est de \`${interaction.client.ws.ping}ms\`.`});
        await interaction.deferUpdate();
    }
};