// realtime (Last 168 heartbeats)
// daily (Last 24 hours (All monitors with 5 minute gaps))
// weekly (Last 7 days (Total of 168 monitors))
// monthly (Last 30 days (Total of 720 monitors))

import Collection from '../../shared/utils/collection.js';
import {
  fetchHeartbeats,
  fetchHourlyHeartbeats,
  fetchDailyHeartbeats,
  createHeartbeat,
  deleteHeartbeats,
  createHourlyHeartbeat,
} from '../database/queries/heartbeat.js';

class Heartbeats {
  constructor() {
    this.heartbeats = new Collection();
    this.dailyHeartbeats = new Collection();
    this.hourlyHeartbeats = new Collection();
  }

  async loadHeartbeats(monitors) {
    for (const monitor of monitors) {
      const monitorId = monitor.monitorId;
      const heartbeats = await fetchHeartbeats(monitorId);
      const hourlyHeartbeats = await fetchHourlyHeartbeats(monitorId);
      const dailyHeartbeats = await fetchDailyHeartbeats(monitorId);

      this.heartbeats.set(monitorId, heartbeats);
      this.hourlyHeartbeats.set(monitorId, hourlyHeartbeats);
      this.dailyHeartbeats.set(monitorId, dailyHeartbeats);
    }
  }

  get(monitorId) {
    const heartbeats = this.heartbeats.get(monitorId) || [];

    if (heartbeats < 12) {
      return heartbeats;
    }

    return heartbeats.slice(0, 12);
  }

  getRealtime(monitorId) {
    // Return the last 168 heartbeats
    const heartbeats = this.heartbeats.get(monitorId) || [];

    return heartbeats;
  }

  getDaily(monitorId) {
    return this.dailyHeartbeats.get(monitorId) || [];
  }

  getWeekly(monitorId) {
    const heartbeats = this.hourlyHeartbeats.get(monitorId) || [];

    // 168 hours in a week
    if (heartbeats.length > 168) {
      return heartbeats.slice(0, 168);
    }

    return heartbeats;
  }

  getMonthly(monitorId) {
    const heartbeats = this.hourlyHeartbeats.get(monitorId) || [];
    return heartbeats;
  }

  addFifthMinuteHeartbeat(monitorId, heartbeat) {
    const heartbeats = this.dailyHeartbeats.get(monitorId) || [];

    // 288 heartbeats in a day (24 hours * 12 (12 = 5-minute intervals))
    if (heartbeats.length > 288) {
      // remove the last heartbeat (oldest)
      heartbeats.pop();
    }

    // add the new heartbeat to the beginning of the array (newest)
    heartbeats.unshift(heartbeat);

    this.dailyHeartbeats.set(monitorId, heartbeats);
  }

  async addHourlyHeartbeat(monitorId, heartbeat) {
    const heartbeats = this.hourlyHeartbeats.get(monitorId) || [];

    const query = await createHourlyHeartbeat(heartbeat);

    // 720 hours in a month
    if (heartbeats.length > 720) {
      // remove the last heartbeat (oldest)
      heartbeats.pop();
    }

    // add the new heartbeat to the beginning of the array (newest)
    heartbeats.unshift(query);

    this.hourlyHeartbeats.set(monitorId, heartbeats);
  }

  async getLastHeartbeat(monitorId) {
    return fetchHeartbeats(monitorId, 1);
  }

  async addHeartbeat(monitorId, heartbeat) {
    const heartbeats = this.heartbeats.get(monitorId) || [];

    const databaseHeartbeat = await createHeartbeat(heartbeat);

    // 168 hours in a week
    if (heartbeats.length > 168) {
      // remove the last heartbeat (oldest)
      heartbeats.pop();
    }

    // add the new heartbeat to the beginning of the array (newest)
    heartbeats.unshift(databaseHeartbeat);

    this.heartbeats.set(monitorId, heartbeats);
  }

  async delete(monitorId) {
    await deleteHeartbeats(monitorId);
    this.heartbeats.delete(monitorId);
  }
}

export default Heartbeats;
