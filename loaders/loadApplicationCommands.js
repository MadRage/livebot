module.exports = async function loadApplicationCommands(client) { 
    await client.application.commands.set(client.commands.map(command => command.data));
    console.log("[SlashCommands] => created");
};