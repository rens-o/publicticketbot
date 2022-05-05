const {SlashCommandBuilder} = require('@discordjs/builders');
const discord = require("discord.js");
const connection = require("../database/db.js")
module.exports = {

    data: new SlashCommandBuilder()
        .setName('bal')
        .setDescription('Get the balance of a user or yourself.')
        .addMentionableOption(option =>
            option.setName("name")
                .setDescription("Name of the user you want to get the balance of.")
        ),
    async execute(client, interaction) {
        const user = interaction.options.getMentionable(`name`) || interaction.user.id


        connection.query(`SELECT bal
                          FROM eco
                          WHERE id = ? `, [user.id || interaction.user.id], (err, row) => {
            try {
                interaction.reply({
                    content: `${user.user || interaction.user} has **${row[0].bal}$** in their bank.`,
                    ephemeral: true
                })
            } catch (err) {
                interaction.reply({content: "User does not have a profile yet.", ephemeral: true})
            }

        })
    }
}