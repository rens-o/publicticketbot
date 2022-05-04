const {Permissions} = require("discord.js");
const discord = require("discord.js");
let hastebin = require('hastebin');
module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {


        if (interaction.isButton()) {
            const {customId, values, member} = interaction;

            if (interaction.customId === "support") {

                if (client.guilds.cache.get(interaction.guildId).channels.cache.find(c => c.topic == interaction.user.id)) {
                    return interaction.reply({
                        content: 'You have already created a ticket!',
                        ephemeral: true
                    });
                }


                interaction.guild.channels.create(`ticket-${interaction.user.username}`, {
                    type: "GUILD_TEXT", permissionOverwrites: [
                        {
                            id: interaction.user.id,
                            allow: [Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.ATTACH_FILES]
                        },
                        {
                            id: interaction.guild.roles.everyone,
                            deny: [Permissions.FLAGS.VIEW_CHANNEL]
                        },
                        {
                            id: "920313505662513193",
                            allow: [Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.ATTACH_FILES]
                        }


                    ], parent: "920313627188264962", topic: interaction.user.id
                }).then(async c => {


                    const row = new discord.MessageActionRow()
                        .addComponents(
                            new discord.MessageButton()
                                .setCustomId("close")
                                .setLabel("Click here to close the ticket.")
                                .setStyle("DANGER")
                                .setEmoji("🗑️")
                        )

                    const thanksEmbed = new discord.MessageEmbed()
                        .setDescription("Thank you for creating a ticket. Our staff-team will respond ASAP.")
                        .setColor("RED")

                    c.send({embeds: [thanksEmbed], components: [row]})

                    const openEmbed = new discord.MessageEmbed()
                        .setDescription(`**Ticket successfully created ${c}.**`)
                        .setColor("RED")

                    await interaction.reply({embeds: [openEmbed], ephemeral: true})


                })


            }
            if (interaction.customId === "close") {
                if (!interaction.member.permissions.has("MANAGE_MESSAGES"))
                    return interaction.reply("You do not have the permissions to do this.")


                const confirm = new discord.MessageEmbed()
                    .setTitle("Are you sure you want to close the ticket?")
                    .setColor("RED")

                const row = new discord.MessageActionRow()
                    .addComponents(
                        new discord.MessageButton()
                            .setCustomId("close2")
                            .setLabel("Close")
                            .setStyle("DANGER")
                            .setEmoji("🗑️")
                    )
                    .addComponents(
                        new discord.MessageButton()
                            .setCustomId("cancel")
                            .setLabel("Cancel")
                            .setStyle("SECONDARY")
                            .setEmoji("🚫")
                    )
                interaction.reply({embeds: [confirm], components: [row]})

            }
            if (interaction.customId === "close2") {
                const guild = client.guilds.cache.get(interaction.guildId);
                const chan = guild.channels.cache.get(interaction.channelId);

                if (!interaction.member.permissions.has("MANAGE_MESSAGES"))
                    return interaction.reply("You do not have the permissions to do this.")
                const transcriptCreated = new discord.MessageEmbed()
                    .setDescription("**Transcript is being created...**")
                interaction.reply({
                    embeds: [transcriptCreated]
                });

                chan.messages.fetch().then(async (messages) => {
                    let a = messages.filter(m => m.author.bot !== true).map(m =>
                        `${new Date(m.createdTimestamp).toLocaleString('am-AM')} - ${m.author.username}#${m.author.discriminator}: ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`
                    ).reverse().join('\n');
                    if (a.length < 1) a = "Nothing"
                    hastebin.createPaste(a, {
                        contentType: 'text/plain',
                        server: 'https://hastebin.com'
                    }, {})
                        .then(function (urlToPaste) {
                            const embed = new discord.MessageEmbed()
                                .setAuthor({name: 'Logs Ticket', iconURL: 'https://i.ibb.co/gmpsPGc/Rocket-Logo-Rens.png'})
                                .setDescription(`📰 Ticket logged \`${chan.id}\` created by <@!${chan.topic}> and deleted by <@!${interaction.user.id}>\n\nLogs: [**Click here to see the logs.**](${urlToPaste})`)
                                .setColor('2f3136')
                                .setTimestamp();

                            const embed2 = new discord.MessageEmbed()
                                .setAuthor({name: 'Logs Ticket', iconURL: 'https://i.ibb.co/gmpsPGc/Rocket-Logo-Rens.png'})
                                .setDescription(`📰 Ticket logged. \`${chan.id}\`: [**Click here to see the logs.**](${urlToPaste})`)
                                .setColor('2f3136')
                                .setTimestamp();

                            client.channels.cache.get("920313471780917288").send({
                                embeds: [embed]
                            });
                            client.users.cache.get(chan.topic).send({
                                embeds: [embed2]
                            }).catch();

                            const delChannel = new discord.MessageEmbed()
                                .setDescription("**Channel is being deleted...**")

                            chan.send({
                                embeds: [delChannel]
                            });

                            setTimeout(() => {
                                chan.delete();
                            }, 5000);
                        });
                });

            }
            if (interaction.customId === "cancel") {
                if (!interaction.member.permissions.has("MANAGE_MESSAGES"))
                    return interaction.reply("You do not have the permissions to do this.")

                interaction.channel.send("Ticket closing canceled.").then(msg => {
                    setTimeout(() => {
                        msg.delete()
                        interaction.message.delete()
                    }, 5000)
                });


            }
        }
        else if (interaction.isCommand()) {

            const slashCommand = client.slashCommands.get(interaction.commandName);
            if (!slashCommand) return interaction.reply("Command not found.");

            try {
                return await slashCommand.execute(client, interaction);

            } catch (err) {
                console.log(err)
                await interaction.reply({ content: "Something went wrong.", ephemeral: true });
            }
        }
    }
}