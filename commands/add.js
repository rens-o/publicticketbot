const {SlashCommandBuilder} = require('@discordjs/builders');
const discord = require("discord.js");
module.exports = {

    data: new SlashCommandBuilder()
        .setName('add')
        .setDescription('Adds a user to a ticket.')
        .addMentionableOption(option =>
            option.setName("user")
                .setDescription("User to add to the ticket.")
                .setRequired(true)
        ),
    async execute(client, interaction) {

        const user = interaction.options.getMentionable("user")
        interaction.channel.permissionOverwrites.create(user, {VIEW_CHANNEL: true, SEND_MESSAGES: true})

        const embed = new discord.MessageEmbed()
            .setDescription(`Succesfully added **${user}** to the ticket.`)
        interaction.reply({embeds: [embed]})

    }

}