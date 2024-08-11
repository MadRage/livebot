const { readdirSync } = require("fs");

module.exports = function loadInteractions(client) {

    let count = 0;
    const dirsInteraction = readdirSync("./interactions/");

    for(const dir of dirsInteraction) {
        const filesDirs = readdirSync(`./interactions/${dir}/`).filter(f => f.endsWith(".js"));
        for(const file of filesDirs) {
            const interaction = require(`../interactions/${dir}/${file}`);
            client.interactions.set(interaction.name, interaction);
            count++;
        };
    };

    console.log(`[Interactions] => ${count} loaded interactions`);
};