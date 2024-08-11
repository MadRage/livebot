const { Events, InteractionType, PermissionFlagsBits, PermissionsBitField } = require("discord.js");

module.exports = {

    name: Events.InteractionCreate,
    once: false,

    async run(client, interaction) {

        switch(interaction.type) {

            case InteractionType.ApplicationCommand: {
                const command = client.commands.get(interaction.commandName);

                const missing = command.permissions.flatMap(p => new PermissionsBitField(p).toArray()).filter(p => !interaction.guild.members.me.permissions.toArray().includes(p))
                if(!(await interaction.guild.members.fetchMe()).permissions.has(PermissionFlagsBits.Administrator) && missing.length > 0) return await interaction.reply({content: `Je n'ai pas ${missing.length > 1 ? "les" : "la"} permission${missing.length > 1 ? "s" : ""} requise${missing.length > 1 ? "s" : ""} ${missing.map(p => `\`${new PermissionsBitField(p).toArray()}\``).join(" ")} pour exécuter cette commande.`, ephemeral: true});

                await command.run(interaction);
                break;
            };

            case InteractionType.MessageComponent: {
                const args = interaction.customId.split("_");
                const name = args.shift();
                const component = client.interactions.find(i => i.name === name && i.type === interaction.componentType);
                if(!component) return;

                if(component.permission && !interaction.member.permissions.has(component.permission)) return await interaction.reply({content: `Vous n'avez pas la permission requise \`${new PermissionsBitField(component.permission).toArray()}\` pour exécuter ce component.`, ephemeral: true});
                const missing = component.botpermissions.flatMap(p => new PermissionsBitField(p).toArray()).filter(p => !interaction.guild.members.me.permissions.toArray().includes(p))
                if(!(await interaction.guild.members.fetchMe()).permissions.has(PermissionFlagsBits.Administrator) && missing.length > 0) return await interaction.reply({content: `Je n'ai pas ${missing.length > 1 ? "les" : "la"} permission${missing.length > 1 ? "s" : ""} requise${missing.length > 1 ? "s" : ""} ${missing.map(p => `\`${new PermissionsBitField(p).toArray()}\``).join(" ")} pour exécuter ce component.`, ephemeral: true});
                
                await component.run(interaction, ...args);
                break;
            };

            case InteractionType.ApplicationCommandAutocomplete: {
                const autocomplete = client.interactions.find(i => i.name === interaction.commandName && i.type === interaction.type);
                if(!autocomplete) return;

                await autocomplete.run(interaction);
                break;
            };
        };
    }
};