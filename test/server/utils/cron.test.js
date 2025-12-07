/**
 * @jest-environment node
 */
import { jest } from '@jest/globals';
import { CronJob } from 'cron';

// --- MOCKS ---

jest.mock('cron');
jest.mock('../../../server/utils/logger.js', () => ({
  __esModule: true,
  default: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('../../../server/database/queries/heartbeat.js', () => ({
  cleanHeartbeats: jest.fn(),
  createHourlyHeartbeat: jest.fn(),
  fetchHeartbeatsByDate: jest.fn(),
}));

jest.mock('../../../server/database/queries/monitor.js', () => ({
  fetchMonitors: jest.fn(),
}));

jest.mock('../../../server/utils/config.js', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

jest.mock('../../../server/cache/status.js', () => ({
  __esModule: true,
  default: {
    loadAllStatusPages: jest.fn(),
  },
}));

// Mock SQLite setup to control the .client property
jest.mock('../../../server/database/sqlite/setup.js', () => ({
  __esModule: true,
  default: {
    client: true, // Default to true so jobs run
  },
}));

// Mock the shared MS utility
jest.mock('../../../shared/utils/ms.js', () => ({
  stringToMs: jest.fn(),
}));

// --- IMPORTS ---
import initialiseCronJobs from '../../../server/utils/cron.js';
import logger from '../../../server/utils/logger.js';
import * as heartbeatQueries from '../../../server/database/queries/heartbeat.js';
import * as monitorQueries from '../../../server/database/queries/monitor.js';
import config from '../../../server/utils/config.js';
import statusCache from '../../../server/cache/status.js';
import sqlite from '../../../server/database/sqlite/setup.js';
import { stringToMs } from '../../../shared/utils/ms.js';

describe('Cron Jobs Utility', () => {
  // Store the callbacks passed to CronJob so we can trigger them manually
  let jobs = {};

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    // Reset job storage
    jobs = {};

    // Mock CronJob constructor to capture the pattern and the callback
    CronJob.mockImplementation((pattern, onTick) => {
      jobs[pattern] = onTick;
      return { start: jest.fn() }; // Return a dummy object
    });

    // Default SQLite client to connected
    sqlite.client = true;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Initialization', () => {
    it('should initialize 3 cron jobs', async () => {
      await initialiseCronJobs();

      expect(logger.info).toHaveBeenCalledWith('Cron', { message: 'Initialising cron jobs' });
      expect(CronJob).toHaveBeenCalledTimes(3);
      
      // Verify the patterns exist
      expect(jobs['*/5 * * * *']).toBeDefined(); // Status Pages
      expect(jobs['0 * * * *']).toBeDefined();   // Hourly Heartbeat
      expect(jobs['0 0 * * *']).toBeDefined();   // Daily Cleanup
    });
  });

  describe('Job 1: Every 5 Minutes (Status Pages)', () => {
    it('should load all status pages if sqlite client exists', async () => {
      await initialiseCronJobs();
      const statusJob = jobs['*/5 * * * *'];

      await statusJob();

      expect(logger.info).toHaveBeenCalledWith('Cron', { message: 'Loading all status pages' });
      expect(statusCache.loadAllStatusPages).toHaveBeenCalled();
    });

    it('should NOT load status pages if sqlite client is missing', async () => {
      sqlite.client = false; // Simulate DB disconnect
      await initialiseCronJobs();
      const statusJob = jobs['*/5 * * * *'];

      await statusJob();

      expect(statusCache.loadAllStatusPages).not.toHaveBeenCalled();
    });

    it('should log error if loadAllStatusPages fails', async () => {
      statusCache.loadAllStatusPages.mockRejectedValue(new Error('Cache failed'));
      await initialiseCronJobs();
      const statusJob = jobs['*/5 * * * *'];

      await statusJob();

      expect(logger.error).toHaveBeenCalledWith('Cron - Updating status page', expect.objectContaining({
        error: 'Cache failed',
      }));
    });
  });

  describe('Job 2: Hourly (Hourly Heartbeat Aggregation)', () => {
    it('should process monitors and create hourly heartbeats', async () => {
      // 1. Setup Data
      const mockMonitorId = 'mon1';
      monitorQueries.fetchMonitors.mockResolvedValue([{ monitorId: mockMonitorId }]);
      
      // Mock heartbeats (10ms and 30ms latency)
      heartbeatQueries.fetchHeartbeatsByDate.mockResolvedValue([
        { isDown: false, latency: 10, status: 200 },
        { isDown: false, latency: 30, status: 200 }
      ]);

      // 2. Set Time to a fixed point to test date math
      // Example: 10:30 AM. Last hour calc should result in 9:00 AM timestamp
      const now = new Date('2023-01-01T10:30:00Z').getTime();
      jest.setSystemTime(now);

      await initialiseCronJobs();
      const hourlyJob = jobs['0 * * * *'];

      // 3. Execute
      await hourlyJob();

      // 4. Assertions
      expect(monitorQueries.fetchMonitors).toHaveBeenCalled();
      
      // Check average latency calculation: (10 + 30) / 2 = 20
      expect(heartbeatQueries.createHourlyHeartbeat).toHaveBeenCalledWith(expect.objectContaining({
        monitorId: mockMonitorId,
        latency: 20,
        status: 200, // Should take status from the first result found
      }));
    });

    it('should skip if no monitors are found', async () => {
      monitorQueries.fetchMonitors.mockResolvedValue([]);
      
      await initialiseCronJobs();
      const hourlyJob = jobs['0 * * * *'];
      await hourlyJob();

      expect(heartbeatQueries.fetchHeartbeatsByDate).not.toHaveBeenCalled();
    });

    it('should skip specific monitor if no heartbeats found', async () => {
      monitorQueries.fetchMonitors.mockResolvedValue([{ monitorId: 'mon1' }]);
      heartbeatQueries.fetchHeartbeatsByDate.mockResolvedValue([]); // Empty heartbeats

      await initialiseCronJobs();
      const hourlyJob = jobs['0 * * * *'];
      await hourlyJob();

      expect(heartbeatQueries.createHourlyHeartbeat).not.toHaveBeenCalled();
    });

    it('should skip specific monitor if all heartbeats are down', async () => {
      monitorQueries.fetchMonitors.mockResolvedValue([{ monitorId: 'mon1' }]);
      heartbeatQueries.fetchHeartbeatsByDate.mockResolvedValue([
        { isDown: true, latency: 0 }
      ]); 

      await initialiseCronJobs();
      const hourlyJob = jobs['0 * * * *'];
      await hourlyJob();

      expect(heartbeatQueries.createHourlyHeartbeat).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      monitorQueries.fetchMonitors.mockRejectedValue(new Error('DB Error'));

      await initialiseCronJobs();
      const hourlyJob = jobs['0 * * * *'];
      await hourlyJob();

      expect(logger.error).toHaveBeenCalledWith('Cron', expect.objectContaining({
        message: 'Error running hourly cron job for creating heartbeat',
        error: 'DB Error'
      }));
    });
  });

  describe('Job 3: Daily (Cleanup)', () => {
    it('should clean heartbeats based on retention period', async () => {
      // Mock Config
      config.get.mockReturnValue('30d');
      stringToMs.mockReturnValue(100000); // Mock returning 100,000ms

      await initialiseCronJobs();
      const dailyJob = jobs['0 0 * * *'];

      await dailyJob();

      expect(config.get).toHaveBeenCalledWith('retentionPeriod');
      expect(stringToMs).toHaveBeenCalledWith('30d');
      expect(heartbeatQueries.cleanHeartbeats).toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalledWith('Cron', { message: 'Daily cron job complete' });
    });

    it('should use default retention of 6m if config is missing', async () => {
      config.get.mockReturnValue(null); // No config
      stringToMs.mockReturnValue(500);

      await initialiseCronJobs();
      const dailyJob = jobs['0 0 * * *'];

      await dailyJob();

      expect(stringToMs).toHaveBeenCalledWith('6m');
      expect(heartbeatQueries.cleanHeartbeats).toHaveBeenCalled();
    });

    it('should handle errors during cleanup', async () => {
      heartbeatQueries.cleanHeartbeats.mockRejectedValue(new Error('Cleanup Failed'));

      await initialiseCronJobs();
      const dailyJob = jobs['0 0 * * *'];

      await dailyJob();

      expect(logger.error).toHaveBeenCalledWith('Cron', expect.objectContaining({
        message: 'Error running daily cron job for creating heartbeat',
        error: 'Cleanup Failed',
      }));
    });
  });
});