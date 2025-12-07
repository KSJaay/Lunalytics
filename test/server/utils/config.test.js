/**
 * @jest-environment node
 */
import { jest } from '@jest/globals';

// --- MOCKS ---
jest.mock('fs');
jest.mock('../../../server/utils/logger.js', () => ({
  __esModule: true,
  default: {
    info: jest.fn(),
    error: jest.fn(),
    notice: jest.fn(),
  },
}));

// Helper to load fresh modules for every test
const loadModules = async () => {
  jest.resetModules();
  const fs = (await import('fs')).default;
  const logger = (await import('../../../server/utils/logger.js')).default;

  // Defaults
  fs.existsSync.mockReturnValue(true);
  fs.readFileSync.mockReturnValue(JSON.stringify({ websiteUrl: 'http://test.com' }));
  fs.writeFileSync.mockImplementation(() => {});
  fs.watch.mockImplementation(() => ({ close: jest.fn() }));

  const config = (await import('../../../server/utils/config.js')).default;

  return { config, fs, logger };
};

describe('Config Class', () => {
  const mockConfigPath = `${process.cwd()}/data/config.json`;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should load configuration if file exists', async () => {
      const { config, fs, logger } = await loadModules();

      expect(fs.existsSync).toHaveBeenCalledWith(mockConfigPath);
      expect(fs.readFileSync).toHaveBeenCalledWith(mockConfigPath);
      expect(logger.info).toHaveBeenCalledWith('CONFIG', { message: 'Loading configuration...' });
      
      expect(config.get('websiteUrl')).toBe('http://test.com');
    });

    it('should log notice when readConfigFile is called and file does not exist', async () => {
      // 1. Reset Modules
      jest.resetModules();
      const fs = (await import('fs')).default;
      const logger = (await import('../../../server/utils/logger.js')).default;

      // 2. Simulate file missing
      fs.existsSync.mockReturnValue(false); 
      fs.watch.mockImplementation(() => ({ close: jest.fn() }));

      // 3. Import config (Constructor runs -> sees no file -> returns early)
      const config = (await import('../../../server/utils/config.js')).default;

      // 4. Manually call the method to verify the logging logic works
      config.readConfigFile();

      expect(logger.notice).toHaveBeenCalledWith('CONFIG', expect.objectContaining({
        message: expect.stringContaining('Configuration file not found'),
      }));
    });

    it('should set up a file watcher', async () => {
      const { fs } = await loadModules();
      expect(fs.watch).toHaveBeenCalledWith(mockConfigPath, { persistent: false }, expect.any(Function));
    });

    it('should handle errors during file watching setup', async () => {
      jest.resetModules();
      const fs = (await import('fs')).default;
      const logger = (await import('../../../server/utils/logger.js')).default;

      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue('{}');
      fs.watch.mockImplementation(() => { throw new Error('Watch error'); });

      await import('../../../server/utils/config.js');

      expect(logger.error).toHaveBeenCalledWith('CONFIG', expect.objectContaining({
        message: 'Watch error',
      }));
    });
  });

  describe('Parsing Logic', () => {
    it('should override database name to "e2etest" when NODE_ENV is test', async () => {
      jest.resetModules();
      const fs = (await import('fs')).default;
      const logger = (await import('../../../server/utils/logger.js')).default;

      fs.existsSync.mockReturnValue(true);
      fs.watch.mockImplementation(() => ({ close: jest.fn() }));
      fs.readFileSync.mockReturnValue(JSON.stringify({
        database: { name: 'production_db' }
      }));

      const config = (await import('../../../server/utils/config.js')).default;

      const dbConfig = config.get('database');
      expect(dbConfig.name).toBe('e2etest');
      expect(logger.info).toHaveBeenCalledWith('CONFIG', expect.objectContaining({
        message: expect.stringContaining('Changed database name'),
      }));
    });

    it('should handle invalid JSON in config file', async () => {
      jest.resetModules();
      const fs = (await import('fs')).default;
      const logger = (await import('../../../server/utils/logger.js')).default;

      fs.existsSync.mockReturnValue(true);
      fs.watch.mockImplementation(() => ({ close: jest.fn() }));
      fs.readFileSync.mockReturnValue('{ invalid json: ');

      await import('../../../server/utils/config.js');

      expect(logger.error).toHaveBeenCalledWith('CONFIG', expect.objectContaining({
        message: 'Unable to parse config file JSON',
      }));
    });
  });

  describe('Methods', () => {
    it('get(key) should return value if key exists', async () => {
      const { config } = await loadModules();
      // Default mock returns websiteUrl
      expect(config.get('websiteUrl')).toBe('http://test.com');
    });

    it('get(key) should return null if key does not exist', async () => {
      const { config } = await loadModules();
      expect(config.get('nonExistentKey')).toBeNull();
    });

    it('set(key, value) should update config and write to disk', async () => {
      const { config, fs } = await loadModules();

      config.set('newKey', 'newValue');

      expect(config.get('newKey')).toBe('newValue');
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        mockConfigPath,
        expect.stringContaining('"newKey": "newValue"'),
      );
    });
  });

  describe('File Watcher Callback', () => {
    it('should reload config when file changes', async () => {
      jest.resetModules();
      const fs = (await import('fs')).default;

      let watchCallback;
      fs.watch.mockImplementation((path, options, cb) => {
        watchCallback = cb;
        return { close: jest.fn() };
      });
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(JSON.stringify({ websiteUrl: 'http://original.com' }));

      const config = (await import('../../../server/utils/config.js')).default;

      expect(fs.readFileSync).toHaveBeenCalledTimes(1);
      expect(config.get('websiteUrl')).toBe('http://original.com');

      if (watchCallback) {
        fs.readFileSync.mockReturnValue(JSON.stringify({ websiteUrl: 'http://updated.com' }));
        watchCallback('change');
      }

      expect(fs.readFileSync).toHaveBeenCalledTimes(2);
      expect(config.get('websiteUrl')).toBe('http://updated.com');
    });
  });
});