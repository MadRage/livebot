const { createConnection } = require("mysql2");
require("dotenv").config();

module.exports = class Database {

    constructor() {
        this.db = createConnection({
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_DB
        });
    };

    connect() {
        this.db.connect(function(err) {
            if(err) throw err;
            console.log("[Database] => connected");
        });
        return this.db;
    };


    async insert(table, keyvalues, values) {
        return new Promise(resolve => {
            this.db.query(`INSERT INTO ${table} (${keyvalues.join(", ")}) VALUES (${values.map(value => `'${value}'`).join(", ")})`, (err) => {
                if(err) throw err;
                resolve();
            });
        });
    };

    delete(table, key, keyID) {
        const array = [];
        for(let i = 0; i < key?.length; i++) array.push(`${key[i]} = '${keyID[i]}'`);
        this.db.query(`DELETE FROM ${table}${array.length > 0 ? ` WHERE ${array.join(" AND ")}` : ""}`);
    };

    update(table, keyvalue, value, key, keyID) {
        const array = [];
        for(let i = 0; i < key?.length; i++) array.push(`${key[i]} = '${keyID[i]}'`);
        this.db.query(`UPDATE ${table} SET ${keyvalue} = '${value}' WHERE ${array.join(" AND ")}`);
    };

    async select(table, key, keyID) {
        const array = [];
        for(let i = 0; i < key?.length; i++) array.push(`${key[i]} = '${keyID[i]}'`);
        return new Promise(resolve => this.db.query(`SELECT * FROM ${table}${array.length > 0 ? ` WHERE ${array.join(" AND ")}` : ""}`, async (err, res) => resolve(res)));
    };
};