const { stdout } = require('node:process');
const { format } = require('node:util');

const COLORS = {
    BLACK: '\x1b[30m',
    RED: '\x1b[31m',
    GREEN: '\x1b[32m',
    YELLOW: '\x1b[33m',
    BLUE: '\x1b[34m',
    MAGENTA: '\x1b[35m',
    CYAN: '\x1b[36m',
    WHITE: '\x1b[37m',
    DEFAULT: '\x1b[39m',
};

/**
 * @param {string} info
 * @param {any[]} options
 */
module.exports.info = (info, ...options) => {
    const text = format(info, options);
    stdout.write(format('%s %s [INFO] %s %s\n', getTimestamp(), COLORS.GREEN, COLORS.DEFAULT, text));
};

/**
 * @param {string} warn
 * @param {any[]} options
 */
module.exports.warn = (warn, ...options) => {
    const text = format(warn, options);
    stdout.write(format('%s %s [WARN] %s %s\n', getTimestamp(), COLORS.YELLOW, COLORS.DEFAULT, text));
};

/**
 * @param {string} error
 * @param {any[]} options
 */
module.exports.error = (error, ...options) => {
    const text = format(error, options);
    stdout.write(format('%s %s [ERROR] %s %s\n', getTimestamp(), COLORS.RED, COLORS.DEFAULT, text));
};

/**
 * @param {string} debug
 * @param {any[]} options
 */
module.exports.debug = (debug, ...options) => {
    const text = format(debug, options);
    stdout.write(format('%s %s [DEBUG] %s %s\n', getTimestamp(), COLORS.BLUE, COLORS.DEFAULT, text));
};

function getTimestamp() {
    const now = new Date();
    const HOUR = now.getHours();
    const MINUTE = now.getMinutes();
    const SECOUND = now.getSeconds();

    return format('%s[%d:%d:%d]%s', COLORS.WHITE, HOUR, MINUTE, SECOUND, COLORS.DEFAULT);
}
