class LogMethods {
  log(section, msg, level) {
    let importance = {
      INFO: '\x1b[96m[INFO]\x1b[39m',
      WARN: '\x1b[33m[WARN]\x1b[39m',
      ERROR: '\x1b[91m[ERROR]\x1b[39m',
    };
    const message = `${
      typeof msg === 'string'
        ? `${new Date().toISOString()} [${section}] ${
            importance[level]
          }: ${msg}`
        : msg
    }`;
    if (level === 'INFO') {
      console.info(message);
    } else if (level === 'WARN') {
      console.warn(message);
    } else if (level === 'ERROR') {
      console.error(message);
    } else {
      console.log(message);
    }
  }
  info(section, msg) {
    this.log(section, msg, 'INFO');
  }

  warn(section, msg) {
    this.log(section, msg, 'WARN');
  }

  error(section, msg) {
    this.log(section, msg, 'ERROR');
  }
}

const Logger = new LogMethods();

module.exports = Logger;
