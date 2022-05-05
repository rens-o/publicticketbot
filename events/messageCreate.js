const discord = require("discord.js");
const connection = require("../database/db.js")
module.exports = {
    name: "messageCreate", async execute(message) {
        if(message.author.bot) return;
        connection.query(`SELECT *
                          FROM eco
                          WHERE id = ${message.author.id}`, (err, row) => {


            if (row.length <= 0) {
                connection.query(`INSERT INTO eco (bal, id)
                                  VALUES (0, ${message.author.id})`, err => {
                    if (err) throw err;
                })

            }
        })
    }

}