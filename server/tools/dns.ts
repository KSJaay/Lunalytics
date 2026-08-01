import type { MonitorProps } from '../../shared/types/monitor.d.js';

// import dependencies
import { Resolver } from 'node:dns/promises';

// import local files
import logger from '../utils/logger.js';

const dnsStatusCheck = async (monitor: MonitorProps) => {
  const startTime = Date.now();

  try {
    const dnsResponse: any = await resolveDns(
      monitor.url,
      monitor.dnsResolver,
      monitor.dnsRecordType,
      monitor.port
    );

    let dnsMessage = '';

    if (
      !dnsResponse ||
      (Array.isArray(dnsResponse) && dnsResponse.length === 0)
    ) {
      throw new Error('No DNS records found');
    }

    switch (monitor.dnsRecordType) {
      case 'A':
      case 'AAAA':
      case 'PTR':
      case 'TXT': {
        dnsMessage = `Resolved addresses: ${dnsResponse.join(', ')}`;
        break;
      }
      case 'CNAME': {
        dnsMessage = `Resolved CNAME: ${dnsResponse[0]}`;
        break;
      }
      case 'CAA': {
        const caaRecords = dnsResponse
          .map(
            (record: any) =>
              `Flag: ${record.flags}, Tag: ${record.tag}, Value: ${record.value}`
          )
          .join('; ');
        dnsMessage = `Resolved CAA records: ${caaRecords}`;
        break;
      }
      case 'MX': {
        const mxRecords = dnsResponse
          .map(
            (record: any) =>
              `Exchange: ${record.exchange}, Priority: ${record.priority}`
          )
          .join('; ');
        dnsMessage = `Resolved MX records: ${mxRecords}`;
        break;
      }
      case 'NS': {
        dnsMessage = `Resolved NS records: ${dnsResponse.join(', ')}`;
        break;
      }
      case 'SRV': {
        const srvRecords = dnsResponse
          .map(
            (record: any) =>
              `Target: ${record.name}, Port: ${record.port}, Priority: ${record.priority}, Weight: ${record.weight}`
          )
          .join('; ');
        dnsMessage = `Resolved SRV records: ${srvRecords}`;
        break;
      }
    }

    if (!dnsMessage) {
      throw new Error('No DNS records found');
    }

    return {
      monitorId: monitor.monitorId,
      workspaceId: monitor.workspaceId,
      status: 'resolved',
      latency: Date.now() - startTime,
      message: dnsMessage,
      isDown: false,
    };
  } catch (error: any) {
    logger.error('DNS Status Check', {
      message: `Issue checking monitor ${monitor.monitorId}: ${error.message}`,
      stack: error.stack,
    });

    return {
      monitorId: monitor.monitorId,
      workspaceId: monitor.workspaceId,
      status: 'down',
      latency: Date.now() - startTime,
      message: `DNS resolution failed: ${error.message}`,
      isDown: true,
    };
  }
};

const resolveDns = async (
  url: string,
  dnsResolver: string,
  dnsRecordType: string,
  port: number | string = 53
) => {
  const resolver = new Resolver();
  resolver.setServers([`[${dnsResolver}]:${port}`]);

  if (dnsRecordType === 'PTR') {
    return resolver.reverse(url);
  }

  return resolver.resolve(url, dnsRecordType as any);
};

export default dnsStatusCheck;
