const Discord = require("discord.js")
const intents = new Discord.IntentsBitField(53608447);
const loadCommands = require("../loaders/loadCommands");
const loadEvents = require("../loaders/loadEvents");
const loadInteractions = require("../loaders/loadInteractions");
const loadApplicationCommands = require("../loaders/loadApplicationCommands");
const Database = require("./Database");
const { setStorageFolder } = require("discord-backup");

module.exports = class Client extends Discord.Client {

    constructor() {
        super({ intents, partials: [Discord.Partials.Channel, Discord.Partials.GuildMember, Discord.Partials.GuildScheduledEvent, Discord.Partials.Message, Discord.Partials.Reaction, Discord.Partials.ThreadMember, Discord.Partials.User] });
        this.color = "#2b2d31";
        this.commands = new Discord.Collection();
        this.interactions = new Discord.Collection();
        this.snipe = new Discord.Collection();
        this.db = new Database();
        this.functions = {};
    };

    async start(token) {
        setStorageFolder("./backups");
        loadCommands(this);
        loadEvents(this);
        loadInteractions(this);
        this.db.connect();
        await this.login(token);
        await loadApplicationCommands(this);
    };
};