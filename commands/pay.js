const {SlashCommandBuilder} = require('@discordjs/builders');
const discord = require("discord.js");
const connection = require("../database/db.js")
module.exports = {

    data: new SlashCommandBuilder()
        .setName('pay')
        .setDescription('Pay someone a user money.')
        .addMentionableOption(option =>
            option.setName("name")
                .setDescription("The user you want to send the money to.")
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName("amount")
                .setDescription("The amount you want to send to the user.")
                .setRequired(true)
        ),
    async execute(client, interaction) {
        const user = interaction.options.getMentionable(`name`)
        connection.query(`SELECT *
                          FROM eco
                          WHERE id = ${interaction.user.id}`, (err, row) => {
            const money = interaction.options.getInteger(`amount`)
            if (row[0].bal - money < 0) {
                interaction.reply({content: "You do not have enough money to pay this amount.", ephemeral: true})
                return;
            }
            try {
                const newBalMinus = row[0].bal - money
                connection.query(`UPDATE eco
                                  SET bal = ${newBalMinus}
                                  WHERE id = ${interaction.user.id} `)

                const newBalPlus = row[0].bal + money
                connection.query(`UPDATE eco
                                  SET bal = ${newBalPlus}
                                  WHERE id = ${user.id}`)
                return interaction.reply({content: `Successfully sent ${user} **${money}**!`, ephemeral: true});
            } catch (err) {
            }
        })


    }
}