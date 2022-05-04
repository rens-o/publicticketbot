const { SlashCommandBuilder } = require('@discordjs/builders');
const discord = require("discord.js");
module.exports = {

    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Remove a user from a ticket.')
        .addMentionableOption(option=>
            option.setName("user")
                .setDescription("User to add to the ticket.")
                .setRequired(true)
        ),
    async execute(client, interaction) {


        const user = interaction.options.getMentionable("user")
        interaction.channel.permissionOverwrites.create(user, {VIEW_CHANNEL: false, SEND_MESSAGES: false})

        const embed = new discord.MessageEmbed()
            .setDescription(`Succesfully removed **${user}** from the ticket.`)
        interaction.reply({embeds: [embed]})



    }
}