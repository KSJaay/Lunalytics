import { afterAll, beforeAll, vi } from 'vitest';

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

const loggerModule: any = await import('../../server/utils/logger.js');
const logger: any = loggerModule.default;
if (logger?.transports) {
  logger.transports.forEach((t: any) => {
    t.silent = true;
  });
}
if (logger) {
  for (const level of [
    'error',
    'warn',
    'info',
    'notice',
    'debug',
    'verbose',
    'silly',
  ]) {
    if (typeof logger[level] === 'function') {
      logger[level] = () => logger;
    }
  }
}

beforeAll(async () => {
  const { default: logger } = await import('../../server/utils/logger.js');
  if (logger && (logger as any).transports) {
    (logger as any).transports.forEach((t: any) => {
      t.silent = true;
    });
  }

  try {
    const nock = (await import('nock')).default;
    nock.disableNetConnect();
    nock.enableNetConnect(
      (host) => host.includes('127.0.0.1') || host.includes('localhost')
    );
  } catch {
    console.log(
      'Failed to set up nock — if you see unexpected network requests in tests, this is probably why.'
    );
  }
});

afterAll(async () => {
  try {
    const nock = (await import('nock')).default;
    nock.cleanAll();
    nock.enableNetConnect();
  } catch {
    console.log(
      'Failed to clean up nock — if you see unexpected network requests in tests, this is probably why.'
    );
  }
  vi.restoreAllMocks();
});
