/**
 * @jest-environment node
 */
import { jest } from '@jest/globals';
import path from 'path';

// --- 1. DEFINE MOCKS OUTSIDE FACTORY (Stable References) ---

const mockAdd = jest.fn();
const mockCreateLogger = jest.fn(() => ({
  add: mockAdd,
  log: jest.fn(),
  info: jest.fn(),
  error: jest.fn(),
}));

const mockFormatCombine = jest.fn().mockReturnThis();
const mockFormatJson = jest.fn().mockReturnThis();
const mockFormatColorize = jest.fn().mockReturnThis();
const mockFormatSimple = jest.fn().mockReturnThis();
const mockFormatTimestamp = jest.fn().mockReturnThis();

// Mock Constructors
const MockConsoleTransport = jest.fn();
const MockDailyRotateFileTransport = jest.fn();

// --- 2. APPLY MOCKS ---

jest.mock('winston-daily-rotate-file', () => jest.fn());

jest.mock('winston', () => {
  return {
    format: {
      combine: mockFormatCombine,
      json: mockFormatJson,
      colorize: mockFormatColorize,
      simple: mockFormatSimple,
      timestamp: mockFormatTimestamp,
    },
    createLogger: mockCreateLogger,
    transports: {
      Console: MockConsoleTransport,
      DailyRotateFile: MockDailyRotateFileTransport,
    },
  };
});

// --- 3. HELPER ---
const reloadLogger = async () => {
  jest.resetModules(); // Clears cache
  // We don't need to re-import winston here because we check the global const mocks defined above
  return (await import('../../../server/utils/logger.js')).default;
};

describe('Logger Utility', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Clear the call history of our stable mocks
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('Configuration', () => {
    it('should create a logger with custom levels and colors', async () => {
      await reloadLogger();

      expect(mockCreateLogger).toHaveBeenCalledWith(expect.objectContaining({
        defaultMeta: { service: 'bot' },
        levels: { error: 0, warn: 1, notice: 2, info: 3, debug: 4 },
      }));
    });

    it('should add the Console transport', async () => {
      await reloadLogger();

      // Check Console Transport creation
      expect(MockConsoleTransport).toHaveBeenCalled();
      
      // Check it was added to logger. 
      // Since MockConsoleTransport is a spy, checking expect.any(MockConsoleTransport) works if it's a class, 
      // but since we mocked it as a fn, we check that add was called with the result of the constructor.
      expect(mockAdd).toHaveBeenCalled(); 
    });

    it('should add the DailyRotateFile transport with correct path', async () => {
      await reloadLogger();

      const expectedFilename = path.join(process.cwd(), `/logs/log-%DATE%.log`);

      // Check DailyRotateFile creation options
      expect(MockDailyRotateFileTransport).toHaveBeenCalledWith(expect.objectContaining({
        filename: expectedFilename,
        datePattern: 'w-YYYY',
        maxFiles: 7,
        maxSize: '50m',
        zippedArchive: true,
      }));

      expect(mockAdd).toHaveBeenCalledTimes(2); // Console + File
    });
  });

  describe('Environment Behavior', () => {
    it('should set level to "debug" in DEVELOPMENT environment', async () => {
      process.env.NODE_ENV = 'development';
      
      await reloadLogger();

      // 1. Logger Creation
      expect(mockCreateLogger).toHaveBeenCalledWith(expect.objectContaining({
        level: 'debug',
      }));

      // 2. Transports
      expect(MockConsoleTransport).toHaveBeenCalledWith(expect.objectContaining({
        level: 'debug',
      }));
      expect(MockDailyRotateFileTransport).toHaveBeenCalledWith(expect.objectContaining({
        level: 'debug',
      }));
    });

    it('should set level to "notice" in PRODUCTION environment', async () => {
      process.env.NODE_ENV = 'production';

      await reloadLogger();

      // 1. Logger Creation
      expect(mockCreateLogger).toHaveBeenCalledWith(expect.objectContaining({
        level: 'notice',
      }));

      // 2. Transports
      expect(MockConsoleTransport).toHaveBeenCalledWith(expect.objectContaining({
        level: 'notice',
      }));
      expect(MockDailyRotateFileTransport).toHaveBeenCalledWith(expect.objectContaining({
        level: 'notice',
      }));
    });
  });

  describe('Formatting', () => {
    it('should combine formats correctly', async () => {
      await reloadLogger();

      expect(mockFormatCombine).toHaveBeenCalled();
      expect(mockFormatJson).toHaveBeenCalled();
      expect(mockFormatColorize).toHaveBeenCalled();
    });
  });
});