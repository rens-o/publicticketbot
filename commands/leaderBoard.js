const {SlashCommandBuilder} = require('@discordjs/builders');
const discord = require("discord.js");
const connection = require("../database/db.js")
module.exports = {

    data: new SlashCommandBuilder()
        .setName('lb')
        .setDescription('Get the leaderboard of this server.'),
    async execute(client, interaction) {

        connection.query(`SELECT *
                          FROM eco
                          ORDER BY bal DESC
                          LIMIT 5`,  async (err, row) => {

            try {

                const user = await client.users.fetch(`${row[0].id}`, {cache: true});
                const userTag = `${user.username}`;

                const user2 = await client.users.fetch(row[1].id, {cache: true});
                const userTag2 = `${user2.username}`;

                // const user3 = await client.users.fetch(row[2].user, {cache: true});
                // const userTag3 = `${user3.username}`;
                //
                // const user4 = await client.users.fetch(row[3].user, {cache: true});
                // const userTag4 = `${user4.username}`;
                //
                // const user5 = await client.users.fetch(row[4].user, {cache: true});
                // const userTag5 = `${user5.username}`;


                const embed = new discord.MessageEmbed()
                    .setTitle("Balance Leaderboard")
                    .setDescription(`🥇 \`${userTag}\` - **${row[0].bal}**\n\n🥈 \`${userTag2}\` - **${row[1].bal}**`)
                    //.setDescription(`🥇 \`${userTag}\` - **${row[0].level}**\n🥇 \`${userTag2}\` - **${row[1].level}**\n🥇 \`${userTag3}\` - **${row[2].level}**\n🥇 \`${userTag4}\` - **${row[3].level}**\n🥇 \`${userTag5}\` - **${row[4].level}**\n`)
                    .setFooter({
                        text: "Leaderboard - " + `${client.user.username}`,
                        iconURL: client.user.displayAvatarURL()
                    })

                return interaction.reply({embeds: [embed]});

            } catch (err) {
                console.log(err)
                return interaction.reply({content: "No userinfo found."});
            }
        })

    }
}