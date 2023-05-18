require('dotenv').config();
const express = require('express');
const app = express();
const { info } = require('./Logger');

const { verifyKeyMiddleware } = require('discord-interactions');

const axios = require('axios').default;

const discordAxios = axios.create({
    baseURL: 'https://discord.com/api/v10',
    headers: {
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
    },
});

const Interaction = require('./structures/Interaction');
const { glob } = require('glob');

let commands;

const commandsArray = [];

glob('src/commands/*.js', { absolute: true }, (error, matches) => {
    matches.forEach((commandPath) => {
        const NewCommand = require(commandPath);
        const command = new NewCommand();
        commandsArray.push(command);
    });
    discordAxios.put(`/applications/${process.env.DISCORD_APPLICATION_ID}/commands`, commandsArray);
});

app.post('/interactions', verifyKeyMiddleware(process.env.DISCORD_PUBLIC_KEY), async (req, res) => {
    res.json({ type: 5 });
    const interaction = req.body;
    if (interaction.type !== 2) return;
    const command = commandsArray.find((c) => c.name === interaction.data.name);
    if (command) command.run(new Interaction(interaction, res));
});

const port = process.env.PORT;

app.listen(port, async () => {
    info(`Username Checker Ready`);
    info(`Server Ready`);
});

const ngrok = require('ngrok');

(async function () {
    const url = await ngrok.connect({ authtoken: process.env.NGROK_TOKEN, addr: port });
    info(url);
})();
