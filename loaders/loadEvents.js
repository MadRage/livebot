const { readdirSync } = require("fs");

module.exports = function loadEvents(client) {

    let count = 0;
    const dirsEvent = readdirSync("./events/");

    for(const dir of dirsEvent) {
        const filesDir = readdirSync(`./events/${dir}/`).filter(f => f.endsWith(".js"));
        for(const file of filesDir) {
            const event = require(`../events/${dir}/${file}`);
            client[event.once ? "once" : "on"](event.name, (...eventArgs) => event.run(client, ...eventArgs));
            count++;
        };
    };

    console.log(`[Events] => ${count} loaded events`);
};