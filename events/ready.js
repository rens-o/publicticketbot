const discord = require("discord.js");


module.exports = {
    name: "ready", async execute(client, message) {
        console.log(`${client.user.username} has successfully been deployed.`);

        const statusOptions = ["by Rens", "Tickets", "Chats"]

        let counter = 0;
        let time = 5 * 1000;

        const updateStatus = () => {


            client.user.setPresence({

                status: "online", activities: [{
                    name: statusOptions[counter]
                }]

            });

            if (++counter >= statusOptions.length) counter = 0;

            setTimeout(updateStatus, time);


        }

        updateStatus()

    }
}