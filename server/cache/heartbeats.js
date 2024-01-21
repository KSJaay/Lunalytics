const {
  fetchHeartbeats,
  createHeartbeat,
  deleteHeartbeats,
} = require('../database/queries/heartbeat');

class Heartbeats {
  constructor() {
    this.heartbeats = new Map();
  }

  async get(monitorId) {
    const heartbeats = this.heartbeats.get(monitorId);

    if (heartbeats) {
      return heartbeats;
    }

    const query = await fetchHeartbeats(monitorId);
    this.heartbeats.set(monitorId, query);

    return query;
  }

  async add(heartbeat) {
    const heartbeats = await this.get(heartbeat.monitorId);

    const data = await createHeartbeat(heartbeat);

    if (heartbeats.length >= 12) {
      heartbeats.pop();
    }

    heartbeats.unshift(data);
    this.heartbeats.set(heartbeat.monitorId, heartbeats);

    return heartbeats;
  }

  async delete(monitorId) {
    await deleteHeartbeats(monitorId);
    this.heartbeats.delete(monitorId);
  }
}

module.exports = Heartbeats;
