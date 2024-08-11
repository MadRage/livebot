const Client = require("./classes/Client");
const client = new Client();
require("dotenv").config();

(async() => await client.start(process.env.TOKEN))();