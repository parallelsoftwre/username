const Command = require('../structures/Command');
const active = new Map();
const axios = require('axios').default;
const UsernameManager = require('../managers/UsernameManager');

module.exports = class ConfigCommand extends Command {
    constructor() {
        super({
            name: 'username',
            description: 'Base username checker command.',
            options: [
                {
                    name: 'check',
                    description: 'Check if a username in the new username system is available',
                    type: 1,
                    options: [
                        {
                            name: 'username',
                            description: 'The username you want to search for availability',
                            required: true,
                            type: 3,
                        },
                    ],
                },
                {
                    name: 'guide',
                    description: 'Guide for the new username system',
                    type: 1,
                },
            ],
        });
    }

    async run(interaction, res) {
        switch (interaction.data.options[0].name) {
            case 'check': {
                try {
                    const username = interaction.data.options[0].options[0].value;
                    const manager = new UsernameManager();
                    const valid = await manager.usernameValid(username);

                    if (!valid) {
                        const unavailableEmbed = {
                            description: `<:taken:1108555017838923786> The username \`\`${username}\`\` contains invalid characters. Use \`\`/username guide\`\` for a guide to creating a username.`,
                            color: 15548997,
                        };
                        return interaction.followUp({ embeds: [unavailableEmbed] });
                    }

                    const response = await manager.usernameTaken(username);

                    if (response === false) {
                        const availableEmbed = {
                            description: `<:available:1108555407900803102> The username \`\`${username}\`\` is available!`,
                            color: 5763719,
                        };
                        return interaction.followUp({ embeds: [availableEmbed] });
                    } else {
                        const unavailableEmbed = {
                            description: `<:taken:1108555017838923786> The username \`\`${username}\`\` has been taken/reserved.`,
                            color: 15548997,
                        };
                        return interaction.followUp({ embeds: [unavailableEmbed] });
                    }
                } catch (error) {
                    console.log(error);
                }
                break;
            }

            case 'guide': {
                try {
                    const successMessage = {
                        title: `Username Guide`,
                        fields: [
                            {
                                name: `Permitted characters for new usernames`,
                                value: `**• Latin characters (a-z)**\n**• Numbers (0-9)**\n**• Certain special characters:**\nUnderscore ( _ )\nPeriod ( . )\n<:blank:900490890399862827>`,
                            },
                            {
                                name: `Restrictions for new usernames`,
                                value: `• Usernames must be at least 2 characters and at most 32 characters long\n• Usernames are case insensitive and forced lowercase\n• Usernames cannot use any other special characters besides underscore ( _ ) and period ( . )\n• Usernames cannot use 2 consecutive period characters ( . )\n• Usernames must abide by Discord ToS\n<:blank:900490890399862827>`,
                            },
                            {
                                name: `Display Names`,
                                value: `Display names are what will appear when you type in a chat, on the member list, in DMs, etc. They act as a global nickname.\n\n<:writer:1108567392075923548> **Editors Note:** Display names have already rolled out to everyone.`,
                            },
                        ],
                        color: 3092790,
                    };

                    interaction.followUp({ embeds: [successMessage], ephemeral: false });
                    break;
                } catch {
                    return interaction.followUp(
                        '<:GameDrop_Error:1077625467307294720> Ran into an error while trying to execute your request.\n[Get Support](https://discord.gg/uNTefVFPBn)',
                    );

                    break;
                }
            }

            default: {
                interaction.followUp('<:GameDrop_Error:1077625467307294720> Unknown Config');
            }
        }
    }
};
