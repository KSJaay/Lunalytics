import path from 'path';
import winston from 'winston';
import 'winston-daily-rotate-file';

const buildLogger = () => {
  const isProduction = process.env.NODE_ENV === 'production';

  const levels = { error: 0, warn: 1, info: 2, notice: 3, debug: 4 };

  const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    notice: 'magenta',
    debug: 'cyan',
  };

  class TimestampFirst {
    transform(obj) {
      return Object.assign({ timestamp: Date.now() }, obj);
    }
  }

  const timestampFormat = winston.format.combine(
    new TimestampFirst(),
    winston.format.json()
  );

  const winLogger = winston.createLogger({
    format: timestampFormat,
    defaultMeta: { service: 'bot' },
    levels,
  });

  if (!isProduction) {
    const colorize = new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ colors }),
        winston.format.simple()
      ),
    });

    winLogger.add(colorize);
  }

  const transporter = new winston.transports.DailyRotateFile({
    filename: path.join(process.cwd(), `/logs/log-%DATE%.log`),
    datePattern: 'w-YYYY',
    format: winston.format.combine(winston.format.json()),
    zippedArchive: true,
    maxFiles: 7,
    maxSize: '50m',
  });

  winLogger.add(transporter);

  return {
    error: (message, data = {}) => winLogger.error(message, data),
    warn: (message, data = {}) =>
      isProduction ? null : winLogger.warn(message, data),
    info: (message, data = {}) =>
      isProduction ? null : winLogger.info(message, data),
    notice: (message, data = {}) => winLogger.notice(message, data),
    debug: (message, data = {}) =>
      isProduction ? null : winLogger.debug(message, data),
  };
};

const logger = buildLogger();

export default logger;
