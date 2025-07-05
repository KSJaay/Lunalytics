export * from './statusPage.js';
import { default as http } from './http.js';
import { default as json } from './json.js';
import { default as ping } from './ping.js';
import { default as tcp } from './tcp.js';

export const cleanMonitor = (
  monitor,
  includeHeartbeats = true,
  includeCert = true
) => {
  const type = monitor?.type?.toLowerCase();

  switch (type) {
    case 'http':
      return http(monitor, includeHeartbeats, includeCert);
    case 'json':
      return json(monitor, includeHeartbeats, includeCert);
    case 'ping':
      return ping(monitor, includeHeartbeats);
    case 'tcp':
      return tcp(monitor, includeHeartbeats);
    default:
      return http(monitor, includeHeartbeats, includeCert);
  }
};
