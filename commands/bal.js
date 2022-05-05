const { SlashCommandBuilder } = require('@discordjs/builders');
const discord = require("discord.js");
const connection = require("../database/db.js")
module.exports = {

    data: new SlashCommandBuilder()
        .setName('abcd')
        .setDescription('Test command.')
        .addMentionableOption(option=>
            option.setName("name")
                .setDescription("Name of the user you want to get the balance of.")
                .setRequired(false)
        ),
    async execute(client, interaction) {
    const user = interaction.options.getMentionable(`name`);
        connection.query(`SELECT bal FROM eco WHERE id = ? `, [interaction.user.id], (err, row) =>{
            console.log(row[0].bal)

        })
    }
}