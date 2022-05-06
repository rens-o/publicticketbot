const discord = require("discord.js");
const config = require("../config.json");
module.exports = {
    name: "ready",
    async execute(client, message) {
        console.log(`${client.user.username} has successfully been deployed.`);

        const statusOptions = [
            "by Rens",
            "Tickets",
            "Chats"
        ]

        let counter = 0;
        let time = 5 * 1000;

        const updateStatus = () => {


            client.user.setPresence({

                status: "online",
                activities: [{
                    name: statusOptions[counter]
                }]

            });

            if (++counter >= statusOptions.length) counter = 0;

            setTimeout(updateStatus, time);


        }

        updateStatus()


        const ticketEmbed = new discord.MessageEmbed()
            .setTitle("Tickets")
            .setFooter({text:`${client.user.username} Tickets`, iconURL: client.user.displayAvatarURL()})
            .setDescription(`Click on the button below to create a ticket.`)
            .setColor("RED")

        const row = new discord.MessageActionRow()
            .addComponents(
                new discord.MessageButton()
                    .setCustomId("support")
                    .setLabel("Create a ticket")
                    .setStyle("DANGER")
                    .setEmoji("🎫")
            )
        const chan = client.channels.cache.get(config.ticketChannel)
        chan.bulkDelete(1)
       chan.send({embeds: [ticketEmbed], components: [row]})


    }
}
