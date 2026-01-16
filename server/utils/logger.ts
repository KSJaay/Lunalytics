import path from 'path';
import winston from 'winston';
import 'winston-daily-rotate-file';

const buildLogger = () => {
  const isProduction = process.env.NODE_ENV === 'production';

  const levels = { error: 0, warn: 1, notice: 2, info: 3, debug: 4 };
  const level = isProduction ? 'notice' : 'debug';

  const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    notice: 'magenta',
    debug: 'cyan',
  };

  class TimestampFirst {
    transform(obj: any) {
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
    level,
  });

  const colorize = new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize({ colors }),
      winston.format.simple()
    ),
    level,
  });

  winLogger.add(colorize);

  const transporter = new winston.transports.DailyRotateFile({
    filename: path.join(process.cwd(), `/logs/log-%DATE%.log`),
    datePattern: 'w-YYYY',
    format: winston.format.combine(winston.format.json()),
    zippedArchive: true,
    maxFiles: 7,
    maxSize: '50m',
    level,
  });

  winLogger.add(transporter);

  return winLogger;
};

const logger = buildLogger();

export default logger;
