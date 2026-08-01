import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EventEmitter } from 'events';

const { mockRequest } = vi.hoisted(() => ({ mockRequest: vi.fn() }));

vi.mock('http', () => ({
  default: { request: mockRequest },
  request: mockRequest,
}));

import dockerStatusCheck, {
  getListOfDockerContainers,
} from '../../../server/tools/docker.js';

const setupResponse = (body: any) => {
  mockRequest.mockImplementation((...args: any[]) => {
    const cb = args.find((a) => typeof a === 'function');
    const req = new EventEmitter() as any;
    req.end = vi.fn();
    if (!cb) return req;
    const res = new EventEmitter() as any;
    queueMicrotask(() => {
      cb(res);
      res.emit('data', JSON.stringify(body));
      res.emit('end');
    });
    return req;
  });
};

const setupError = (msg: string) => {
  mockRequest.mockImplementation(() => {
    const req = new EventEmitter() as any;
    req.end = vi.fn();
    req.once('newListener', (event: string) => {
      if (event === 'error') {
        queueMicrotask(() => req.emit('error', new Error(msg)));
      }
    });
    return req;
  });
};

const monitor = {
  monitorId: 'd-1',
  workspaceId: 'ws-1',
  url: 'mycontainer',
  socketPath: '/var/run/docker.sock',
} as any;

describe('server/tools/docker', () => {
  beforeEach(() => mockRequest.mockReset());

  it('returns isDown=false when container is running', async () => {
    setupResponse({
      State: {
        Status: 'running',
        Running: true,
        Health: { Status: 'healthy' },
      },
    });
    const result = await dockerStatusCheck(monitor);
    expect(result.isDown).toBe(false);
    expect(result.status).toBe('healthy');
    expect(result.message).toContain('running');
  });

  it('returns isDown=true when container is stopped', async () => {
    setupResponse({ State: { Status: 'exited', Running: false } });
    const result = await dockerStatusCheck(monitor);
    expect(result.isDown).toBe(true);
  });

  it('returns isDown=true on transport error', async () => {
    setupError('connect ENOENT');
    const result = await dockerStatusCheck(monitor);
    expect(result.isDown).toBe(true);
  });

  it('getListOfDockerContainers returns the array on success', async () => {
    setupResponse([{ Id: 'a' }, { Id: 'b' }]);
    const containers = (await getListOfDockerContainers()) as any[];
    expect(containers).toHaveLength(2);
  });

  it('getListOfDockerContainers returns [] on error', async () => {
    setupError('socket missing');
    const containers = await getListOfDockerContainers();
    expect(containers).toEqual([]);
  });
});
