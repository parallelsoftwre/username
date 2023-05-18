const axios = require('axios');

class Interaction {
    constructor(data, res) {
        this.type = data.type;
        this.token = data.token;
        this.id = data.id;
        this.guild_id = data.guild_id;
        this.channel_id = data.channel_id;
        this.data = data.data;
        this.member = data.member;
        this.res = res;
    }

    followUp(message) {
        axios.post(`https://discord.com/api/v10/webhooks/${process.env.DISCORD_APPLICATION_ID}/${this.token}`, message);
    }
}

module.exports = Interaction;
