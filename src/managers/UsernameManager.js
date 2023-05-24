const axios = require('axios').default;
// added cache results incase the same usernames are constantly being searched for. less network requests
class UsernameManager {
    constructor() {
        this.cache = new Map();
    }

    async usernameTaken(username) {
        if (this.cache.has(username)) {
            return this.cache.get(username);
        }

        try {
            const response = await axios.get('https://pomelo-check.onrender.com/list');
            const { taken, invalid } = response.data.data;

            const isTaken = taken.includes(username) || invalid.includes(username);
            this.cache.set(username, isTaken);

            return isTaken;
        } catch (error) {
            throw new Error('Error retrieving data: ' + error);
        }
    }

    async usernameValid(username) {
        const length = username.length;
        const validCharsRegex = /^[a-z0-9_.]+$/i;
        const regex = validCharsRegex.test(username);

        if (length >= 2 && length <= 32 && regex) {
            return true; // both length and regex validations pass
        } else {
            return false; // either length or regex validation fails
        }
    }

    async checkUsername(username) {
        if (!this.usernameValid(username)) {
            throw new Error('Invalid username');
        }

        return this.usernameTaken(username);
    }

    async checkUsername(username) {
        if (!this.usernameValid(username)) {
            throw new Error('Invalid username');
        }
        
        return this.usernameTaken(username);
    }
}

module.exports = UsernameManager;