require('dotenv').config();
const express = require('express');
const app = express();
const { info } = require('./Logger');
const { verifyKeyMiddleware } = require('discord-interactions');
const axios = require('axios').default;
const Interaction = require('./structures/Interaction');
const { glob } = require('glob');
const ngrok = require('ngrok');

// check if the required env variables exist. (better for self hosters, since its public yk people are :Sob:)
if (!process.env.DISCORD_TOKEN || !process.env.DISCORD_APPLICATION_ID || !process.env.DISCORD_PUBLIC_KEY || !process.env.PORT || !process.env.NGROK_TOKEN) {
    throw new Error("Missing required environment variables.");
}

const discordAxios = axios.create({
    baseURL: 'https://discord.com/api/v10',
    headers: {
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
    },
});

let commandsArray = [];

async function loadCommands() {
    return new Promise((resolve, reject) => {
        glob('src/commands/*.js', { absolute: true }, (error, matches) => {
            if (error) {
                reject(error);
            } else {
                matches.forEach((commandPath) => {
                    try {
                        const NewCommand = require(commandPath);
                        const command = new NewCommand();
                        commandsArray.push(command);
                        console.log(`Loaded command: ${command.name}`);
                    } catch (err) {
                        console.error(`Error loading command at ${commandPath}:`, err);
                    }
                });
                resolve(commandsArray);
            }
        });
    });
}

app.post('/interactions', verifyKeyMiddleware(process.env.DISCORD_PUBLIC_KEY), async (req, res) => {
    res.json({ type: 5 });
    const interaction = req.body;
    if (interaction.type !== 2) return;
    const command = commandsArray.find((c) => c.name === interaction.data.name);
    if (command) command.run(new Interaction(interaction, res));
});

async function startServer() {
    await loadCommands();
    discordAxios.put(`/applications/${process.env.DISCORD_APPLICATION_ID}/commands`, commandsArray);
    const port = process.env.PORT;
    app.listen(port, async () => {
        info(`Username Checker Ready`);
        info(`Server Ready`);
        const url = await ngrok.connect({ authtoken: process.env.NGROK_TOKEN, addr: port });
        info(url);
    });
}

startServer().catch(error => {
    console.error("Failed to start server:", error);
});