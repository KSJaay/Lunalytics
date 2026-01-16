import type { MonitorProps } from '../../shared/types/monitor.d.js';

import http from 'http';
import logger from '../utils/logger.js';

interface DockerContainerProps {
  Id: string;
  Names: string[];
  Image: string;
  ImageID: string;
  Command: string;
  Created: number;
  Ports: Array<{
    PrivatePort: number;
    PublicPort?: number;
    Type: string;
    IP?: string;
  }>;
  Labels: Record<string, string>;
  Status: string;
  HostConfig: {
    NetworkMode: string;
  };
  NetworkSettings: {
    Networks: Record<string, any>;
  };
  Mounts: Array<{
    Type: string;
    Name?: string;
    Source: string;
    Destination: string;
    Driver?: string;
    Mode: string;
    RW: boolean;
    Propagation: string;
  }>;
  State: {
    Status: string;
    Running: boolean;
    Paused: boolean;
    Restarting: boolean;
    OOMKilled: boolean;
    Dead: boolean;
    Pid: number;
    ExitCode: number;
    Error: string;
    StartedAt: string;
    FinishedAt: string;
    Health?: {
      Status: string;
      FailingStreak: number;
    };
  };
}

const getMessage = (container: DockerContainerProps) => {
  const { Running, Paused, Restarting, Dead } = container.State;

  if (Running) return 'Container is running';
  if (Paused) return 'Container is paused';
  if (Restarting) return 'Container is restarting';
  if (Dead) return 'Container is dead';

  return `Container state: ${container.State.Status}`;
};

const dockerRequest = (
  path: string,
  socketPath: string = '/var/run/docker.sock',
  method: string = 'GET'
) => {
  return new Promise((resolve, reject) => {
    const options = {
      socketPath,
      path,
      method,
      headers: { 'Content-Type': 'application/json' },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(`Failed to parse response: ${e}`);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
};

const dockerStatusCheck = async (monitor: MonitorProps) => {
  const startTime = Date.now();

  try {
    const container = (await dockerRequest(
      `/containers/${monitor.url}/json`
    )) as DockerContainerProps;

    if (!container) {
      throw new Error('Unable to find container with the given ID');
    }

    const isRunning =
      container.State.Status === 'running' && container.State.Running === true;
    const health = container.State.Health?.Status || 'no healthcheck';

    return {
      monitorId: monitor.monitorId,
      workspaceId: monitor.workspaceId,
      status: health,
      latency: Date.now() - startTime,
      message: getMessage(container),
      isDown: !isRunning,
    };
  } catch (error: any) {
    logger.error('Docker Container Status Check', {
      message: `Issue checking monitor ${monitor.monitorId}: ${error.message}`,
      stack: error.stack,
    });

    return {
      monitorId: monitor.monitorId,
      workspaceId: monitor.workspaceId,
      status: 'down',
      latency: Date.now() - startTime,
      message: `Unknown container state`,
      isDown: true,
    };
  }
};

export const getListOfDockerContainers = async (socketUrl: string) => {
  try {
    const containers = await dockerRequest(
      '/containers/json?all=true',
      socketUrl
    );

    return containers;
  } catch (err: any) {
    logger.error('Docker error:', {
      message: err.message,
      stack: err.stack,
    });

    return [];
  }
};

export default dockerStatusCheck;
