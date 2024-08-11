const { SlashCommandBuilder, PermissionFlagsBits, AttachmentBuilder } = require("discord.js");
const { createCanvas, loadImage } = require("canvas");

module.exports = {

    data: new SlashCommandBuilder()
    .setName("around")
    .setDescription("Arrondi la photo de profil d'un utilisateur")
    .setDMPermission(true)
    .setDefaultMemberPermissions(null)
    .addUserOption(option => option.setName("membre").setDescription("Le membre à qui arrondir la photo de profil").setRequired(false)),
    permissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.UseExternalEmojis, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.ViewChannel, PermissionFlagsBits.EmbedLinks],

    async run(interaction) {

        const user = interaction.options.getUser("membre") || interaction.user;

        await interaction.deferReply();

        const canvas = createCanvas(512, 512);
        const ctx = canvas.getContext("2d");

        ctx.beginPath();
        ctx.arc(256, 256, 256, 0, Math.PI * 2, true);
        ctx.closePath();

        ctx.clip();

        const avatar = await loadImage(user.displayAvatarURL({ format: "png", size: 512 }));
        ctx.drawImage(avatar, 0, 0, 512, 512);

        await interaction.followUp({ files: [new AttachmentBuilder(canvas.toBuffer(), { name: "avatar.png" })] });
    }
};