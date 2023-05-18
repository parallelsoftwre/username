const axios = require('axios').default;

class UsernameManager {
    async usernameTaken(username) {
        try {
            const response = await axios.get('https://pomelo-check.onrender.com/list');
            const { taken, invalid } = response.data.data;

            if (taken.includes(username)) {
                return true;
            } else if (invalid.includes(username)) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Error retrieving data:', error);
            return true;
        }
    }

    async usernameValid(username) {
        const validCharsRegex = /^[a-z0-9_.]+$/i;
        return validCharsRegex.test(username);
    }
}

module.exports = UsernameManager;
