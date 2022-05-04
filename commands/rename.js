const { SlashCommandBuilder } = require('@discordjs/builders');
const discord = require("discord.js");
module.exports = {

    data: new SlashCommandBuilder()
        .setName('rename')
        .setDescription('Sends the panel of the bot.')
        .addStringOption(option=>
            option.setName("name")
                .setDescription("Name of the channel.")
                .setRequired(true)
        ),
    async execute(client, interaction) {


        const rename = interaction.options.getString("name")
        interaction.channel.setName(`ticket-${rename}`);
        const embed = new discord.MessageEmbed()
            .setDescription(`Changed ticket name to **ticket-${rename}**.`)
        interaction.reply({embeds: [embed]})


    }
}