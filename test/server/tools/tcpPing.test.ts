import { describe, it, expect, afterEach } from 'vitest';
import net from 'net';

import tcpStatusCheck from '../../../server/tools/tcpPing.js';

let server: net.Server | null = null;

const monitor = {
  monitorId: 'tcp-1',
  workspaceId: 'ws-1',
  url: '127.0.0.1',
  port: 0,
  requestTimeout: 2,
} as any;

describe('server/tools/tcpPing', () => {
  afterEach(
    () =>
      new Promise<void>((resolve) =>
        server ? server.close(() => resolve()) : resolve()
      )
  );

  it('returns isDown=false when the TCP port accepts connections', async () => {
    server = net.createServer();
    await new Promise<void>((resolve) =>
      server!.listen(0, '127.0.0.1', () => resolve())
    );
    const port = (server!.address() as net.AddressInfo).port;

    const result = await new Promise<any>((resolve) =>
      tcpStatusCheck({ ...monitor, port }, (_m, r) => resolve(r))
    );
    expect(result.isDown).toBe(false);
    expect(result.status).toBe(200);
  });

  it('returns isDown=true when the TCP port is closed', async () => {
    const tmp = net.createServer();
    await new Promise<void>((resolve) =>
      tmp.listen(0, '127.0.0.1', () => resolve())
    );
    const port = (tmp.address() as net.AddressInfo).port;
    await new Promise<void>((resolve) => tmp.close(() => resolve()));

    const result = await new Promise<any>((resolve) =>
      tcpStatusCheck({ ...monitor, port }, (_m, r) => resolve(r))
    );
    expect(result.isDown).toBe(true);
  });
});
